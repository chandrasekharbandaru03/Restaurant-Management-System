package com.vcube.restaurantservice.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vcube.restaurantservice.dto.AuthResponse;
import com.vcube.restaurantservice.dto.LoginRequest;
import com.vcube.restaurantservice.dto.RegisterRequest;
import com.vcube.restaurantservice.model.AppUser;
import com.vcube.restaurantservice.model.Role;
import com.vcube.restaurantservice.repo.AppUserRepository;
import com.vcube.restaurantservice.security.JwtService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    // CUSTOMER registration
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        if (appUserRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email is already registered");
        }

        AppUser user = new AppUser();
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);

        AppUser savedUser = appUserRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User registered successfully with ID: "
                        + savedUser.getId());
    }

    // ADMIN and CUSTOMER login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()));

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);

        AppUser appUser = appUserRepository.findByEmail(request.getEmail()).orElse(null);
        Long userId = appUser != null ? appUser.getId() : null;
        String role = appUser != null && appUser.getRole() != null ? appUser.getRole().name() : "CUSTOMER";

        return ResponseEntity.ok(
                new AuthResponse(token, "Bearer", userId, request.getEmail(), role));
    }

    // Get current authenticated user details
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        String email = authentication.getName();
        return appUserRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(Map.of(
                        "userId", user.getId(),
                        "email", user.getEmail(),
                        "role", user.getRole().name()
                )))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
