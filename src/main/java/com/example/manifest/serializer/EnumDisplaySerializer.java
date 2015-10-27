package com.example.manifest.serializer;

import java.io.IOException;

import com.example.manifest.EnumDisplay;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

/**
 * The Class EnumDisplaySerializer.
 */
public class EnumDisplaySerializer extends JsonSerializer<EnumDisplay> {

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.fasterxml.jackson.databind.JsonSerializer#serialize(java.lang.Object,
	 * com.fasterxml.jackson.core.JsonGenerator,
	 * com.fasterxml.jackson.databind.SerializerProvider)
	 */
	@Override
	public void serialize(EnumDisplay value, JsonGenerator generator, SerializerProvider provider)
			throws IOException, JsonProcessingException {
		generator.writeString(value.getValue());
	}

}
