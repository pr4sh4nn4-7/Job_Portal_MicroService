"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import z from 'zod';
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [btnLoading, setBtnLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()


  const passwordSchema = z
    .string()
    .min(12, "At least 12 characters")
    .regex(/[A-Z]/, "1 uppercase required")
    .regex(/[a-z]/, "1 lowercase required")
    .regex(/[0-9]/, "1 number required")
    .regex(/[^A-Za-z0-9]/, "1 symbol required");

  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const validatePassword = (value: string) => {
    const result = passwordSchema.safeParse(value);

    if (!result.success) {
      const messages = result.error.issues.map((e) => e.message);
      setErrors(messages);
      setSuccess(false);
      return false;
    } else {
      setErrors([]);
      setSuccess(true);
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validatePassword(password);
    if (!isValid) return;

    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_SERVICE}/reset/${token}`, { password });
      toast.success(data.message);
      router.push('/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-zinc-800">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold text-black">Create Password</h2>

          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter strong password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setPassword(value);
                  validatePassword(value);
                }}
                className="bg-zinc-100 text-zinc-500 border-zinc-700 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="space-y-1 text-sm mt-2">
              {[
                { label: "12+ characters", test: password.length >= 12 },
                { label: "Uppercase letter", test: /[A-Z]/.test(password) },
                { label: "Lowercase letter", test: /[a-z]/.test(password) },
                { label: "Number", test: /[0-9]/.test(password) },
                { label: "Symbol", test: /[^A-Za-z0-9]/.test(password) },
              ].map((rule, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 ${rule.test ? "text-green-400" : "text-zinc-500"}`}
                >
                  <span>{rule.test ? "✔" : "•"}</span>
                  <span>{rule.label}</span>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full mt-4 rounded-xl"
              disabled={!success || btnLoading}
            >
              {btnLoading ? "updating password....." : "Submit"}
            </Button>
          </form>

          {errors.length > 0 && (
            <div className="text-red-400 text-sm space-y-1">
              {errors.map((err, i) => (
                <div key={i}>• {err}</div>
              ))}
            </div>
          )}

          {success && (
            <div className="text-green-400 text-sm">Strong password ✓</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
