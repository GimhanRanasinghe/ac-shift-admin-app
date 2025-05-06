"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, X } from "lucide-react"
import jsQR from "jsqr"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scannedCode, setScannedCode] = useState<string | null>(null)

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
        setHasPermission(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please check permissions.")
      setHasPermission(false)
    }
  }

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  // Scan for QR codes
  useEffect(() => {
    if (!isScanning) return

    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const scanQRCode = () => {
      if (!isScanning) return

      // Only process when video is playing
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight
        canvas.width = video.videoWidth

        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

        try {
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          })

          if (code) {
            // QR code detected
            console.log("QR Code detected:", code.data)
            setScannedCode(code.data)
            setIsScanning(false)
          }
        } catch (err) {
          console.error("Error processing QR code:", err)
        }
      }

      // Continue scanning
      if (isScanning) {
        requestAnimationFrame(scanQRCode)
      }
    }

    // Start scanning
    const scanInterval = requestAnimationFrame(scanQRCode)

    return () => {
      cancelAnimationFrame(scanInterval)
    }
  }, [isScanning])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const handleSubmit = () => {
    if (scannedCode) {
      console.log("Submitting QR code:", scannedCode)
      onScan(scannedCode)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 rounded-2xl">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 rounded-full"
            onClick={() => {
              stopCamera()
              onClose()
            }}
          >
            <X className="h-5 w-5" />
          </Button>

          <CardContent className="p-4 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground">Position the QR code within the frame</p>
            </div>

            <div className="relative aspect-square bg-black rounded-xl overflow-hidden">
              {hasPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white p-4 text-center">
                  <div>
                    <p className="mb-4">{error || "Camera access denied"}</p>
                    <Button variant="outline" onClick={onClose} className="rounded-full">
                      Close
                    </Button>
                  </div>
                </div>
              )}

              {hasPermission !== false && (
                <>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                    onCanPlay={() => setIsScanning(true)}
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Scanning overlay */}
                  <div className="absolute inset-0 border-2 border-white border-opacity-50 rounded-xl">
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-aircanada-blue rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-aircanada-blue rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-aircanada-blue rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-aircanada-blue rounded-br-xl"></div>
                  </div>
                </>
              )}
            </div>

            {scannedCode && (
              <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                <p className="text-center font-medium text-green-800">QR Code Detected</p>
                <p className="text-center text-green-700">{scannedCode}</p>
              </div>
            )}

            {!isScanning && hasPermission !== false && !scannedCode && (
              <Button className="w-full bg-aircanada-blue hover:bg-blue-600 rounded-full" onClick={startCamera}>
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
            )}

            {scannedCode && (
              <Button className="w-full bg-aircanada-blue hover:bg-blue-600 rounded-full" onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
