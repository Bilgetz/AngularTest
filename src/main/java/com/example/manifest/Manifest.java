package com.example.manifest;

import static com.example.manifest.EnumDisplay.STANDALONE;
import static com.example.manifest.EnumOrientation.LANDSCAPE;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

/**
 * Instantiates a new manifest.
 * https://developer.mozilla.org/en-US/docs/Web/Manifest
 */

/**
 * Instantiates a new manifest.
 */
@Data
public class Manifest {

	/** The background_color. */
	private String background_color = "white";

	/** The display. */
	private EnumDisplay display = STANDALONE;

	/** The icons. */
	private List<Icon> icons = new ArrayList<>();

	/** The lang. */
	private String lang;

	/** The name. */
	private String name = "Demo angular";

	/** The orientation. */
	private EnumOrientation orientation = LANDSCAPE;

	/** The prefer_related_applications. */
	private boolean prefer_related_applications = false;

	/** The related_applications. */
	private List<RelatedApplication> related_applications = new ArrayList<>();

	/** The start_url. */
	private String start_url = "";

	private String scope = "/";

	/** The short_name. */
	private String short_name = "Demo";

	/** The splash_screens. */
	private List<SplashScreen> splash_screens = new ArrayList<>();

	/** The theme_color. */
	private String theme_color = "white";

}
