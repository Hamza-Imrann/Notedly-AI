"use server"

import { createClient } from "@/supabase/server";
import prisma from "../../prisma/prisma";
import bcrypt from "bcryptjs";

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      errorMessage: error.message,
      user: null,
    };
  }
  return {
    errorMessage: "An unknown error occurred.",
    user: null,
  }
};

export async function loginAction(email: string, password: string) {
  try {
    const { auth } = await createClient();
    const { data, error } = await auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return {
      errorMessage: null,
      user: data.user,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function logoutAction() {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signOut();

    if (error) {
      throw error;
    }

    return {
      errorMessage: null,
      user: null,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function signupAction(name: string, email: string, password: string) {
  try {
    const { auth } = await createClient();
    const { data, error } = await auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw error;
    }

    const userId = data.user?.id;
    if (!userId) {
      throw new Error("Error signing up.");
    }

    const pepper = process.env.PASSWORD_PEPPER || "";
    if (!pepper) {
      throw new Error("Password pepper is not in environment variables.");
    }
    const peppered_password = password + pepper;
    const hashedPassword = await bcrypt.hash(peppered_password, 10);


    // Add user to 'users' table
    await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      errorMessage: null,
      user: data.user,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function forgotPasswordAction(email: string) {
  try {
    const { auth } = await createClient();
    const { data, error } = await auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
    });

    if (error) {
      throw error;
    }

    return {
      errorMessage: null,
      data,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function resetPasswordAction(newPassword: string) {
  try {
    const { auth } = await createClient();
    const { data, error } = await auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return {
      errorMessage: null,
      user: data.user,
    };
  } catch (error) {
    return handleError(error);
  }
}