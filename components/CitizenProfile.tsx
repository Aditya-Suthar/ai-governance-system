"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  name?: string
  role?: string
}

export default function CitizenProfile({ name, role }: Props) {

return (
<Card className="border-0 bg-white shadow-sm">
<CardHeader>
<CardTitle>Citizen Profile</CardTitle>
</CardHeader>

<CardContent className="space-y-3">

<div className="text-lg font-semibold">
{name}
</div>

<div className="text-sm text-gray-500">
Role: {role}
</div>

<div className="text-sm">
Member since: 2026
</div>

<div className="text-sm">
Status: Active Reporter
</div>

</CardContent>
</Card>
)
}