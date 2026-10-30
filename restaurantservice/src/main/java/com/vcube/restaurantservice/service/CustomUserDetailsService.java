package com.vcube.restaurantservice.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.vcube.restaurantservice.repo.AppUserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    public CustomUserDetailsService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        var appUser = appUserRepository.findByEmail(email)
                .orElseThrow(() ->
                    new UsernameNotFoundException("User not found: " + email));

        String roleStr = appUser.getRole() != null ? appUser.getRole().name() : "CUSTOMER";

        return User.withUsername(appUser.getEmail())
                .password(appUser.getPassword())
                .authorities("ROLE_" + roleStr, roleStr)
                .build();
    }
}
