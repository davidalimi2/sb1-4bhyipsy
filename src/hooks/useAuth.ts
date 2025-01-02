const signUp = async (email: string, password: string, userType: 'prose' | 'lawyer', name: string) => {
  if (!email?.trim() || !password?.trim() || !name?.trim()) {
    throw new Error('Please fill in all required fields');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error('Please enter a valid email address');
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      options: {
        data: {
          user_type: userType,
          full_name: name.trim()
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('This email is already registered');
      }
      throw error;
    }

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          user_type: userType,
          full_name: name.trim()
        }]);

      if (profileError) {
        await supabase.auth.signOut();
        throw new Error('Failed to create user profile');
      }
    }

    return data;
  } catch (error) {
    throw error;
  }
};

const signIn = async (email: string, password: string) => {
  // Input validation
  if (!email?.trim()) {
    throw new Error('Please enter your email');
  }
  if (!password?.trim()) {
    throw new Error('Please enter your password');
  }

  // Email format validation
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error('Please enter a valid email address');
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim()
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please try again.');
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('Please verify your email address before signing in');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Too many login attempts. Please try again later');
      }
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};