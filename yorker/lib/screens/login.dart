import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yorker/providers/login.provider.dart';

class LoginPage extends ConsumerWidget {
  static MaterialPageRoute route() => MaterialPageRoute(
        builder: (context) => const LoginPage(),
      );
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final loginState = ref.watch(loginProvider);
    final userNameController = TextEditingController();
    final passwordController = TextEditingController();
    final formKey = GlobalKey<FormState>();
    final obscurePassword = ValueNotifier<bool>(true);

    void loginUser() {
      if (formKey.currentState!.validate()) {
        ref.read(loginProvider.notifier).login(
              context,
              userNameController.text,
              passwordController.text,
            );
      }
    }

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(15.0),
        child: Form(
          key: formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.sports_cricket,
                size: 100,
                color: Colors.black,
              ),
              const Text(
                "Welcome to Yorker :)",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 30),
              TextFormField(
                controller: userNameController,
                decoration: const InputDecoration(
                  hintText: 'akipiD',
                ),
                validator: (value) {
                  return null;
                },
              ),
              const SizedBox(height: 15),
              ValueListenableBuilder<bool>(
                valueListenable: obscurePassword,
                builder: (context, isObscured, _) {
                  return TextFormField(
                    controller: passwordController,
                    obscureText: isObscured,
                    decoration: InputDecoration(
                      hintText: 'Password',
                      suffixIcon: IconButton(
                        icon: Icon(
                          isObscured ? Icons.visibility : Icons.visibility_off,
                        ),
                        onPressed: () {
                          obscurePassword.value = !isObscured;
                        },
                      ),
                    ),
                    validator: (value) {
                      if (value == null ||
                          value.trim().isEmpty ||
                          value.trim().length <= 5) {
                        return "Password field is invalid!";
                      }
                      return null;
                    },
                  );
                },
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: loginUser,
                child: const Text(
                  'LOGIN',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.black,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              if (loginState.error != null)
                Text(
                  loginState.error!,
                  style: const TextStyle(color: Colors.red),
                ),
              if (loginState.token != null)
                Text(
                  'Login successful!',
                  style: const TextStyle(color: Colors.green),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
