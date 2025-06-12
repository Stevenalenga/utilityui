"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CarIcon, FileTextIcon, UserIcon, ShieldIcon, DownloadIcon } from "lucide-react"

interface FormData {
  insurance_type: string
  sum_insured: number
  basic_premium_rate: number
  excess_protector: number
  radio_cassette: string
  windscreen_cover: string
  tl: number
  sd: number
  class_of_insurance: string
  policy_number: string
  name_of_insured: string
  occupation: string
  pin_number: string
  vehicle_covered: string
  engine_no: string
  chasis: string
  sitting_capacity: string
  color: string
  period_of_insurance: string
  terms_of_payment: string
  generated_by?: string
}

export default function DebitNotePage() {
  const [formData, setFormData] = useState<FormData>({
    insurance_type: "",
    sum_insured: 0,
    basic_premium_rate: 3.5,
    excess_protector: 0,
    radio_cassette: "",
    windscreen_cover: "",
    tl: 0,
    sd: 0,
    class_of_insurance: "",
    policy_number: "",
    name_of_insured: "",
    occupation: "",
    pin_number: "",
    vehicle_covered: "",
    engine_no: "",
    chasis: "",
    sitting_capacity: "",
    color: "",
    period_of_insurance: "",
    terms_of_payment: "",
    generated_by: "",
  })

  const [isGenerating, setIsGenerating] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["sum_insured", "basic_premium_rate", "excess_protector", "tl", "sd"].includes(name)
        ? Number.parseFloat(value) || 0
        : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)

    try {
      // Create payload matching backend model
      const payload = {
        insurance_type: formData.insurance_type,
        sum_insured: formData.sum_insured,
        basic_premium_rate: formData.basic_premium_rate,
        excess_protector: formData.excess_protector,
        radio_cassette: formData.radio_cassette,
        windscreen_cover: formData.windscreen_cover,
        tl: formData.tl,
        sd: formData.sd,
        class_of_insurance: formData.class_of_insurance,
        policy_number: formData.policy_number,
        name_of_insured: formData.name_of_insured,
        occupation: formData.occupation,
        pin_number: formData.pin_number,
        vehicle_covered: formData.vehicle_covered,
        engine_no: formData.engine_no,
        chasis: formData.chasis,
        sitting_capacity: formData.sitting_capacity,
        color: formData.color,
        period_of_insurance: formData.period_of_insurance,
        terms_of_payment: formData.terms_of_payment,
        ...(formData.generated_by && { generated_by: formData.generated_by }),
      }

      const response = await fetch("https://utilitycoverapi.vercel.app/generate-debit-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      // Generate filename based on vehicle and current date
      const dateStr = new Date().toLocaleDateString("en-GB").replace(/\//g, "-")
      const vehicleStr = formData.vehicle_covered.replace(/\s+/g, "")
      link.download = `DebitNote_${vehicleStr}_${dateStr}.pdf`

      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please check your connection and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Calculate premium preview
  const calculatePremium = () => {
    const sumInsured = formData.sum_insured || 0
    const basicPremiumRate = formData.basic_premium_rate || 0
    const excessProtector = formData.excess_protector || 0
    const tl = formData.tl || 0
    const sd = formData.sd || 0

    const calculatedBasicPremium = basicPremiumRate === 0 ? sumInsured : (sumInsured * basicPremiumRate) / 100
    const totalPremium = calculatedBasicPremium + excessProtector + tl + sd

    return {
      basicPremium: calculatedBasicPremium,
      totalPremium: totalPremium,
    }
  }

  const { basicPremium, totalPremium } = calculatePremium()

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Motor Insurance Debit Note Generator</h1>
          <p className="text-muted-foreground mt-2">
            Generate professional motor insurance debit notes for Utility Cover Insurance Agencies
          </p>
        </div>
        <div className="hidden md:block">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <ShieldIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Insurance Type Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldIcon className="h-5 w-5" />
              Insurance Type
            </CardTitle>
            <CardDescription>Select the type of motor insurance coverage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="insurance_type">Insurance Type *</Label>
                <Select
                  value={formData.insurance_type}
                  onValueChange={(value) => handleSelectChange("insurance_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select insurance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="third_party">Third Party</SelectItem>
                    <SelectItem value="third_party_fire_theft">Third Party Fire & Theft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="generated_by">Generated By (Optional)</Label>
                <Input
                  id="generated_by"
                  name="generated_by"
                  type="text"
                  value={formData.generated_by}
                  onChange={handleChange}
                  placeholder="Agent or staff name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Policy Details Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileTextIcon className="h-5 w-5" />
              Policy Details
            </CardTitle>
            <CardDescription>Enter the insurance policy information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="policy_number">Policy Number *</Label>
                <Input
                  id="policy_number"
                  name="policy_number"
                  type="text"
                  value={formData.policy_number}
                  onChange={handleChange}
                  placeholder="e.g. POL/123/2024"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="class_of_insurance">Class of Insurance *</Label>
                <Input
                  id="class_of_insurance"
                  name="class_of_insurance"
                  type="text"
                  value={formData.class_of_insurance}
                  onChange={handleChange}
                  placeholder="e.g. Motor Private"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="period_of_insurance">Period of Insurance *</Label>
                <Input
                  id="period_of_insurance"
                  name="period_of_insurance"
                  type="text"
                  value={formData.period_of_insurance}
                  onChange={handleChange}
                  placeholder="e.g. 01/01/2024 to 31/12/2024"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="terms_of_payment">Terms of Payment *</Label>
                <Input
                  id="terms_of_payment"
                  name="terms_of_payment"
                  type="text"
                  value={formData.terms_of_payment}
                  onChange={handleChange}
                  placeholder="e.g. Annual, Quarterly, Monthly, Cash"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insured Details Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserIcon className="h-5 w-5" />
              Insured Details
            </CardTitle>
            <CardDescription>Enter the details of the insured person or entity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="name_of_insured">Name of Insured *</Label>
                <Input
                  id="name_of_insured"
                  name="name_of_insured"
                  type="text"
                  value={formData.name_of_insured}
                  onChange={handleChange}
                  placeholder="Full name of individual or company"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="occupation">Occupation/Business *</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g. Doctor, Business, etc."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pin_number">PIN Number *</Label>
                <Input
                  id="pin_number"
                  name="pin_number"
                  type="text"
                  value={formData.pin_number}
                  onChange={handleChange}
                  placeholder="Tax PIN number"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Details Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CarIcon className="h-5 w-5" />
              Vehicle Details
            </CardTitle>
            <CardDescription>Enter the details of the vehicle being insured</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="vehicle_covered">Vehicle Registration *</Label>
                <Input
                  id="vehicle_covered"
                  name="vehicle_covered"
                  type="text"
                  value={formData.vehicle_covered}
                  onChange={handleChange}
                  placeholder="e.g. KAA 123A"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="engine_no">Engine Number *</Label>
                <Input
                  id="engine_no"
                  name="engine_no"
                  type="text"
                  value={formData.engine_no}
                  onChange={handleChange}
                  placeholder="Vehicle engine number"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="chasis">Chassis Number *</Label>
                <Input
                  id="chasis"
                  name="chasis"
                  type="text"
                  value={formData.chasis}
                  onChange={handleChange}
                  placeholder="Vehicle chassis number"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sitting_capacity">Sitting Capacity *</Label>
                <Input
                  id="sitting_capacity"
                  name="sitting_capacity"
                  type="text"
                  value={formData.sitting_capacity}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Color *</Label>
                <Input
                  id="color"
                  name="color"
                  type="text"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g. Silver, Black, etc."
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coverage & Premium Details Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldIcon className="h-5 w-5" />
              Coverage & Premium Details
            </CardTitle>
            <CardDescription>Enter the insurance coverage and premium calculation information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="sum_insured">Sum Insured (KES) *</Label>
                  <Input
                    id="sum_insured"
                    name="sum_insured"
                    type="number"
                    value={formData.sum_insured}
                    onChange={handleChange}
                    placeholder="e.g. 1500000"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="basic_premium_rate">Basic Premium Rate (%) *</Label>
                  <Input
                    id="basic_premium_rate"
                    name="basic_premium_rate"
                    type="number"
                    value={formData.basic_premium_rate}
                    onChange={handleChange}
                    step="0.01"
                    placeholder="e.g. 3.5"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="excess_protector">Excess Protector (KES)</Label>
                  <Input
                    id="excess_protector"
                    name="excess_protector"
                    type="number"
                    value={formData.excess_protector}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="radio_cassette">Radio Cassette *</Label>
                  <Select
                    value={formData.radio_cassette}
                    onValueChange={(value) => handleSelectChange("radio_cassette", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select radio cassette option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="windscreen_cover">Windscreen Cover *</Label>
                  <Select
                    value={formData.windscreen_cover}
                    onValueChange={(value) => handleSelectChange("windscreen_cover", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select windscreen cover option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="tl">TL (KES)</Label>
                  <Input
                    id="tl"
                    name="tl"
                    type="number"
                    value={formData.tl}
                    onChange={handleChange}
                    placeholder="Training Levy amount"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sd">SD (KES)</Label>
                  <Input
                    id="sd"
                    name="sd"
                    type="number"
                    value={formData.sd}
                    onChange={handleChange}
                    placeholder="Stamp Duty amount"
                  />
                </div>
              </div>

              {/* Premium Preview */}
              {formData.sum_insured > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Premium Preview</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Basic Premium:</span>
                      <span>KES {basicPremium.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Excess Protector:</span>
                      <span>KES {formData.excess_protector.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TL:</span>
                      <span>KES {formData.tl.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SD:</span>
                      <span>KES {formData.sd.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Premium:</span>
                      <span>KES {totalPremium.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <Separator className="mb-6" />
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            Please review all information before generating the debit note. Fields marked with * are required.
          </p>
        </div>
        <Button
          onClick={handleGeneratePDF}
          size="lg"
          className="px-8"
          disabled={isGenerating || !formData.insurance_type || !formData.vehicle_covered}
        >
          {isGenerating ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Generating PDF...
            </>
          ) : (
            <>
              <DownloadIcon className="mr-2 h-5 w-5" />
              Generate and Download PDF
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
