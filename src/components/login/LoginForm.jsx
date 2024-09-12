import React from "react";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";

export default function LoginForm() {
  return (
    <Card className="max-w-sm border border-gray-300 shadow-none">
      <form className="flex flex-col gap-4">
        <div className="flex justify-center items-center">
          <img src="/logo/logo.png" alt="logo" className="w-1/3 z-10" />
        </div>
        <div>
          <TextInput
            id="email1"
            type="email"
            placeholder="ឈ្មោះអ្នកប្រើប្រាស់"
            required
          />
        </div>
        <div>
          <TextInput
            id="password1"
            type="password"
            placeholder="លេខសម្ងាត់"
            required            
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">ចងចាំលេខសម្ងាត់</Label>
        </div>
        <Button type="submit">ចូល</Button>
      </form>
    </Card>
  );
}
