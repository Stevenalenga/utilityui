"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CarIcon, FileTextIcon, UserIcon, ShieldIcon } from "lucide-react"

interface FormData {
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
}

export default function DebitNotePage() {
  const [formData, setFormData] = useState<FormData>({
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
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["sum_insured", "basic_premium_rate", "excess_protector", "tl", "sd"].includes(name)
        ? Number.parseFloat(value) || 0
        : value,
    }))
  }

  const handleGeneratePDF = async () => {
    const dateIssued = new Date().toLocaleDateString("en-GB")

    try {
      const response = await fetch("https://utilitycoverapi.vercel.app/generate-debit-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date_issued: dateIssued,
        }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `DebitNote_${formData.vehicle_covered}_${dateIssued.replace(/\//g, "-")}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Debit Note Generator</h1>
          <p className="text-muted-foreground mt-1">Fill in the details to generate a vehicle insurance debit note</p>
        </div>
        <div className="hidden md:block">
          <img src="/insurance-shield-logo.png" alt="Insurance Logo" className="h-20 w-20" />
        </div>
      </div>

      <div className="grid gap-6">
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
                <Label htmlFor="policy_number">Policy Number</Label>
                <Input
                  id="policy_number"
                  name="policy_number"
                  type="text"
                  value={formData.policy_number}
                  onChange={handleChange}
                  placeholder="e.g. POL/123/2023"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="class_of_insurance">Class of Insurance</Label>
                <Input
                  id="class_of_insurance"
                  name="class_of_insurance"
                  type="text"
                  value={formData.class_of_insurance}
                  onChange={handleChange}
                  placeholder="e.g. Comprehensive"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="period_of_insurance">Period of Insurance</Label>
                <Input
                  id="period_of_insurance"
                  name="period_of_insurance"
                  type="text"
                  value={formData.period_of_insurance}
                  onChange={handleChange}
                  placeholder="e.g. 01/01/2023 to 31/12/2023"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="terms_of_payment">Terms of Payment</Label>
                <Input
                  id="terms_of_payment"
                  name="terms_of_payment"
                  type="text"
                  value={formData.terms_of_payment}
                  onChange={handleChange}
                  placeholder="e.g. Annual/Quarterly/Monthly"
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
                <Label htmlFor="name_of_insured">Name of Insured</Label>
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
                <Label htmlFor="occupation">Occupation/Business</Label>
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
                <Label htmlFor="pin_number">PIN Number</Label>
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
                <Label htmlFor="vehicle_covered">Vehicle Registration</Label>
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
                <Label htmlFor="engine_no">Engine Number</Label>
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
                <Label htmlFor="chasis">Chassis Number</Label>
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
                <Label htmlFor="sitting_capacity">Sitting Capacity</Label>
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
                <Label htmlFor="color">Color</Label>
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

        {/* Coverage Details Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldIcon className="h-5 w-5" />
              Coverage Details
            </CardTitle>
            <CardDescription>Enter the insurance coverage information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="sum_insured">Sum Insured (KES)</Label>
                <Input
                  id="sum_insured"
                  name="sum_insured"
                  type="number"
                  value={formData.sum_insured}
                  onChange={handleChange}
                  placeholder="e.g. 1,500,000"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="basic_premium_rate">Basic Premium Rate (%)</Label>
                <Input
                  id="basic_premium_rate"
                  name="basic_premium_rate"
                  type="number"
                  value={formData.basic_premium_rate}
                  onChange={handleChange}
                  step="0.01"
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
                  placeholder="e.g. 5,000"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="radio_cassette">Radio Cassette</Label>
                <Input
                  id="radio_cassette"
                  name="radio_cassette"
                  type="text"
                  value={formData.radio_cassette}
                  onChange={handleChange}
                  placeholder="e.g. Yes/No or Value"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="windscreen_cover">Windscreen Cover</Label>
                <Input
                  id="windscreen_cover"
                  name="windscreen_cover"
                  type="text"
                  value={formData.windscreen_cover}
                  onChange={handleChange}
                  placeholder="e.g. Yes/No or Value"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tl">TL (KES)</Label>
                  <Input id="tl" name="tl" type="number" value={formData.tl} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sd">SD (KES)</Label>
                  <Input id="sd" name="sd" type="number" value={formData.sd} onChange={handleChange} required />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <Separator className="mb-6" />
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            Please review all information before generating the debit note
          </p>
        </div>
        <Button onClick={handleGeneratePDF} size="lg" className="px-8">
          <FileTextIcon className="mr-2 h-5 w-5" />
          Generate and Download PDF
        </Button>
      </div>
    </div>
  )
}
