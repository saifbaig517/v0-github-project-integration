"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Download, Copy, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function QRCodeGenerator() {
  const [text, setText] = useState("")
  const [size, setSize] = useState([200])
  const [errorCorrection, setErrorCorrection] = useState("M")
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const { toast } = useToast()

  const generateQRCodeURL = () => {
    if (!text.trim()) return ""

    const params = new URLSearchParams({
      data: text,
      size: `${size[0]}x${size[0]}`,
      color: foregroundColor.replace("#", ""),
      bgcolor: backgroundColor.replace("#", ""),
      ecc: errorCorrection,
      format: "png",
    })

    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`
  }

  const downloadQRCode = async () => {
    const url = generateQRCodeURL()
    if (!url) return

    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `qrcode-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      toast({
        title: "Success!",
        description: "QR code downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async () => {
    const url = generateQRCodeURL()
    if (!url) return

    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Copied!",
        description: "QR code URL copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL.",
        variant: "destructive",
      })
    }
  }

  const shareQRCode = async () => {
    const url = generateQRCodeURL()
    if (!url) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: "QR Code",
          text: `QR Code for: ${text}`,
          url: url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">QR Code Generator</h1>
          <p className="text-lg text-gray-600">Create custom QR codes instantly</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Generate QR Code</CardTitle>
              <CardDescription>Enter your text, URL, or data to generate a QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text">Text or URL</Label>
                <Textarea
                  id="text"
                  placeholder="Enter text, URL, or any data..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Size: {size[0]}px</Label>
                <Slider value={size} onValueChange={setSize} max={500} min={100} step={10} className="w-full" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="errorCorrection">Error Correction Level</Label>
                <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foreground">Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="foreground"
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your generated QR code will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                {text.trim() ? (
                  <>
                    <div className="p-4 bg-white rounded-lg shadow-sm border">
                      <img
                        src={generateQRCodeURL() || "/placeholder.svg"}
                        alt="Generated QR Code"
                        className="max-w-full h-auto"
                        style={{ width: size[0], height: size[0] }}
                      />
                    </div>

                    <div className="flex gap-2 flex-wrap justify-center">
                      <Button onClick={downloadQRCode} className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
                        <Copy className="w-4 h-4" />
                        Copy URL
                      </Button>
                      <Button onClick={shareQRCode} variant="outline" className="flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-gray-400 text-sm">QR Code Preview</div>
                    </div>
                    <p className="text-gray-500">Enter text above to generate QR code</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instant Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Generate QR codes instantly as you type. No waiting, no delays.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customizable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Customize colors, size, and error correction levels to fit your needs.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Multiple Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Support for URLs, text, phone numbers, and more data types.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
