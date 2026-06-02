"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Message = {
    sender: "bot" | "user";
    text: string;
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            sender: "bot",
            text: `Welcome to Nova Dental Studio 👋

I'm your virtual dental assistant.

I can help with:
• Dental treatments
• Appointment booking
• Teeth whitening
• Dental implants
• Root canal treatment
• General dental questions

How can I help you today?`,
        },
    ]);

    const [step, setStep] = useState(0);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [treatment, setTreatment] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");

    const [input, setInput] = useState("");

    const addBotMessage = (text: string) => {
        setMessages((prev) => [
            ...prev,
            {
                sender: "bot",
                text,
            },
        ]);
    };

    const addUserMessage = (text: string) => {
        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text,
            },
        ]);
    };

    const startBooking = () => {
        addBotMessage("Great choice. What is your full name?");
        setStep(1);
    };


    const handleSend = async () => {
        if (!input.trim()) return;

        const value = input;

        addUserMessage(value);

        const lower = value.toLowerCase();

        if (
            step === 0 &&
            (
                lower.includes("appointment") ||
                lower.includes("book") ||
                lower.includes("booking") ||
                lower.includes("consultation") ||
                lower.includes("visit")
            )
        ) {
            startBooking();
            setInput("");
            return;
        };
        if (step === 0) {
            try {
                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: value,
                    }),
                });

                const data = await response.json();

                addBotMessage(data.reply);

            } catch {
                addBotMessage(
                    "Sorry, I'm currently unavailable. Please try again in a moment."
                );
            }

            setInput("");
            return;
        }

        else if (step === 1) {
            setName(value);

            setTimeout(() => {
                addBotMessage("What is your phone number?");
            }, 300);

            setStep(2);
        }

        else if (step === 2) {
            setPhone(value);

            setTimeout(() => {
                addBotMessage("What is your email address?");
            }, 300);

            setStep(3);
        }

        else if (step === 3) {
            setEmail(value);

            setTimeout(() => {
                addBotMessage(
                    "Which treatment are you interested in?"
                );
            }, 300);

            setStep(4);
        }

        else if (step === 4) {
            setTreatment(value);

            setTimeout(() => {
                addBotMessage(
                    "What is your preferred appointment date?"
                );
            }, 300);

            setStep(5);
        }

        else if (step === 5) {
            setAppointmentDate(value);

            setTimeout(() => {
                addBotMessage(
                    "What is your preferred appointment time?"
                );
            }, 300);

            setStep(6);
        }

        else if (step === 6) {
            const finalDate = appointmentDate;
            const finalTime = value;

            setAppointmentTime(finalTime);

            const { error } = await supabase
                .from("appointments")
                .insert([
                    {
                        name,
                        phone,
                        email,
                        treatment,
                        appointment_date: finalDate,
                        appointment_time: finalTime,
                    },
                ]);

            if (error) {
                console.error(error);

                addBotMessage(
                    "❌ Something went wrong while saving your appointment."
                );
            } else {

                try {
                    await fetch("/api/send-test-email", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name,
                            phone,
                            email,
                            treatment,
                            appointmentDate: finalDate,
                            appointmentTime: finalTime,
                        }),
                    });

                    console.log("Admin Email Sent");
                } catch (emailError) {
                    console.error("Email Error:", emailError);
                }

                addBotMessage(
                    "✅ Appointment request submitted successfully."
                );

                addBotMessage(
                    "Our team will contact you shortly to confirm your appointment."
                );
            }

            setStep(7);
        }

        else {
            setTimeout(() => {
                addBotMessage(
                    "Please click Book Appointment to start a new booking."
                );
            }, 300);
        }

        setInput("");
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-4 rounded-2xl shadow-xl transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="font-semibold">
                        Ask Nova AI
                    </span>
                </div>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[400px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">

                    <div className="p-5 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-xl text-slate-900">
                                    Nova AI Assistant
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Appointment Booking • Patient Support
                                </p>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="p-5 h-[420px] overflow-y-auto">
                        <div className="space-y-3">

                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={
                                        message.sender === "bot"
                                            ? "bg-cyan-50 border border-cyan-100 rounded-2xl p-4 text-slate-700 max-w-[90%]"
                                            : "bg-slate-100 rounded-2xl p-4 text-slate-700 ml-auto max-w-[90%]"
                                    }
                                >
                                    {message.text}
                                </div>
                            ))}

                        </div>

                        {step === 0 && (
                            <div className="grid gap-3 mt-5">

                                <button
                                    onClick={startBooking}
                                    className="text-left bg-white border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 rounded-2xl p-4 text-slate-700 transition"
                                >
                                    📅 Book Appointment
                                </button>

                            </div>
                        )}

                    </div>

                    <div className="border-t border-slate-200 p-4">
                        <div className="flex gap-2">

                            <input
                                value={input}
                                onChange={(e) =>
                                    setInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSend();
                                    }
                                }}
                                type="text"
                                placeholder="Type your answer..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 placeholder:text-slate-400 outline-none focus:border-cyan-500"
                            />

                            <button
                                onClick={handleSend}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 rounded-2xl font-semibold"
                            >
                                →
                            </button>

                        </div>
                    </div>

                </div>
            )}
        </>
    );
}