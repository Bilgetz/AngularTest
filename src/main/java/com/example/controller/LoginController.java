package com.example.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * The Class LoginController.
 */
@RestController
public class LoginController {

	/**
	 * User.
	 *
	 * @param user
	 *            the user
	 * @return the principal
	 */
	@RequestMapping("/user")
	public Principal user(Principal user) {
		return user;
	}

}
