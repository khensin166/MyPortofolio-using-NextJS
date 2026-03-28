"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import InputField from "@/common/components/elements/InputField";

interface FormEmail {
  name: string;
  email: string;
  message: string;
}

const BACKEND_CONTACT_API = process.env.NEXT_PUBLIC_API_URL + "/contact";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormEmail>();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Send Email");
  const [isSuccess, setIsSuccess] = useState(false);

  const t = useTranslations("ContactPage");

  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useEffect(() => {
    setButtonText(isLoading ? "Sending your message..." : "Send Email");
    if (!isLoading && isSuccess) setButtonText("Your email sent successfully");
    const timeout = setTimeout(() => {
      setButtonText("Send Email");
    }, 5000);
    return () => clearTimeout(timeout);
  }, [isLoading, isSuccess]);

  const handleFormSubmit = async (payload: FormEmail) => {
    setIsLoading(true);
    try {
      // Post to Hono backend instead of local /api/email
      const response = await axios.post(BACKEND_CONTACT_API, payload);
      if (response.status === 200 || response.status === 201) setIsSuccess(true);
      reset();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2>{t("form.title")}</h2>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4 transition-all duration-300"
      >
        <div className="flex w-full flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <InputField
            name="name"
            rule={{ required: true }}
            register={register}
            error={errors}
          />
          <InputField
            name="email"
            rule={{
              required: true,
              pattern: {
                value: regexEmail,
                message: "please enter a valid email",
              },
            }}
            register={register}
            error={errors}
          />
        </div>
        <InputField
          name="message"
          rule={{ required: true }}
          register={register}
          error={errors}
          isTextArea
        />
        <button
          disabled={isLoading}
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium shadow-md transition-all duration-300 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
