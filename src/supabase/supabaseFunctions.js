import supabase from './supabase';  // Import the initialized supabase client

// Function to register a user
export async function registerUser(email, password, name, phone) {
  const { user, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error('Error during registration:', error.message);
    return;
  }

  // Now insert the user into your custom 'users' table
  const { data, error: insertError } = await supabase
    .from('users')
    .insert([
      {
        supabase_user_id: user.id,  // Supabase user ID
        name: name,
        email: email,
        phone: phone,
        role: 'guest',  // Default role is 'guest'
      },
    ]);

  if (insertError) {
    console.error('Error inserting user data:', insertError.message);
    return;
  }

  console.log('User registered successfully', data);
}