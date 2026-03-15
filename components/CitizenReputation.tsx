"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IComplaint } from "@/lib/models/Complaint"

interface Props {
  complaints: IComplaint[]
}

export default function CitizenReputation({ complaints }: Props) {

const total = complaints.length

const resolved = complaints.filter(c => c.status === "Resolved").length

const spam = complaints.filter(c => (c as any).spamProbability > 0.7).length

const valid = total - spam


/* Reputation formula */

let score = 50

score += resolved * 5
score += valid * 2
score -= spam * 10

score = Math.max(0, Math.min(100, score))

function level(score:number){
  if(score > 85) return "Highly Trusted"
  if(score > 60) return "Trusted Citizen"
  if(score > 30) return "Normal Citizen"
  return "Suspicious"
}

return (
<Card className="border-0 bg-white shadow-sm">
<CardHeader>
<CardTitle>Citizen Reputation</CardTitle>
</CardHeader>

<CardContent className="space-y-2">

<div className="text-3xl font-bold">
⭐ {score} / 100
</div>

<div className="text-sm text-gray-500">
Level: {level(score)}
</div>

<div className="pt-4 text-sm space-y-1">

<div>Total Complaints: {total}</div>

<div>Resolved Issues: {resolved}</div>

<div>Valid Complaints: {valid}</div>

<div>Spam Reports: {spam}</div>

</div>

</CardContent>
</Card>
)
}