package com.example.manifest;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Instantiates a new related application.
 */
@Data
@AllArgsConstructor
public class RelatedApplication {

	/** The platform on which the application can be found. **/
	private String platform;

	/** The URL at which the application can be found. **/
	private String url;

	/** The ID used to represent the application on the specified platform. **/
	private String id;

}
