import { useState, FormEvent } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { BASE_URL } from "@/config";

// Define types for the state variables
type UserType = {
    username: string;
    email: string;
    password: string;
};

export const SignUpForm = () => {
    // Use more specific types for each state variable
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Type the handleSubmit function
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Construct the request body with UserType
        const userData: UserType = {
            username: `${firstName}_${lastName}`, // Combine first and last name
            email,
            password,
        };

        try {
            console.log(userData);
            const response = await axios.post(`${BASE_URL}/signup`, userData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Reset state values after successful signup
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            window.location.href = "/signin";
        } catch (err: any) {
            // Add a more specific type for error handling
            if (err.response && err.response.data && err.response.data.error) {
                console.log(err.response.data.error);
                // setError(err.response.data.error); // Uncomment if you have error handling state
            } else {
                console.log("Failed to sign up. Please try again.");
                // setError("Failed to sign up. Please try again."); // Uncomment if you have error handling state
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>Your data is safe with us.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                    id="first-name"
                                    placeholder="Max"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Robinson"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : "Create an account"}
                        </Button>
                    </div>
                </form>

                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/signin" className="underline">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};
