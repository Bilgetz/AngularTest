package com.example.manifest;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Instantiates a new icon.
 */

/**
 * Instantiates a new icon.
 */
@Data
@AllArgsConstructor
public class Icon {

	/** The src.A URL that returns the image. */
	public String src;

	/** The sizes.A string containing space-separated image dimensions. */
	public String sizes;

	/**
	 * The type. A hint as to the media type of the image.The purpose of this
	 * member is to allow a user agent to ignore images of media types it does
	 * not support.
	 */
	public String type;

	/** The density.The device pixel density the image is designed for. */
	public String density;

}
