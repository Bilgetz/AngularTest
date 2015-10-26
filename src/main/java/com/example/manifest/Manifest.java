package com.example.manifest;

import java.util.HashMap;
import java.util.Map;

import lombok.Data;

@Data
public class Manifest {

	private String lang;
	private String name = "Demo angular";
	private String short_name = "Demo";
	private String description = "A demo for test angular";
	private String launch_path;
	private String display = "standalone";
	private String orientation = "landscape";
	private Map<String, String> icons = new HashMap<>();
	private Developer developer = new Developer();
	private String default_locale = "fr";
	private String type = "web";

}
