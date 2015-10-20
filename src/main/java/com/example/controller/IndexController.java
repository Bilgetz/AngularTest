package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * The Class IndexController.
 */
@Controller
public class IndexController {

	/**
	 * Index.
	 *
	 * @return the string
	 */
	@RequestMapping(value = "/")
	public String index() {
		return "index";
	}

	/**
	 * Index partial.
	 *
	 * @return the string
	 */
	@RequestMapping(value = "/partials", method = { RequestMethod.GET })
	public String indexPartial() {
		return "partials/index";
	}

	/**
	 * Partials comments.
	 *
	 * @return the string
	 */
	// @RequestMapping(value = "/partials/comments")
	// public String partialsComments() {
	// return "partials/comments";
	// }

}
