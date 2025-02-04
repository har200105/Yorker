import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yorker/screens/splash.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      child: MaterialApp(
          title: 'Yorker',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            fontFamily: "Poppins",
            appBarTheme: AppBarTheme(
              backgroundColor: Colors.tealAccent[200],
              iconTheme: IconThemeData(color: Colors.white),
            ),
            inputDecorationTheme: InputDecorationTheme(
              contentPadding: const EdgeInsets.all(27),
              enabledBorder: OutlineInputBorder(
                borderSide: BorderSide(
                  color: Colors.grey.shade900,
                  width: 3,
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              focusedBorder: OutlineInputBorder(
                borderSide: const BorderSide(
                  width: 3,
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              border: OutlineInputBorder(
                borderSide: const BorderSide(
                  width: 3,
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              errorBorder: OutlineInputBorder(
                borderSide: const BorderSide(
                  color: Colors.red,
                  width: 3,
                ),
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            elevatedButtonTheme: ElevatedButtonThemeData(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.tealAccent,
                minimumSize: const Size(double.infinity, 60),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
              ),
            ),
            useMaterial3: true,
          ),
          home: SplashScreen()),
    );
  }
}
