package com.example.manifest;

import com.example.manifest.serializer.EnumDisplaySerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(using = EnumDisplaySerializer.class)
public enum EnumDisplay {
	FULLSCREEN("fullscreen"), STANDALONE("standalone"), MINIMAL_UI("minimal-ui"), BROWSER("browser");

	private String value;

	private EnumDisplay(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
