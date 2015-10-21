package com.example.entity;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;

/**
 * The Class Comment.
 */
@Entity
@Data
public class Comment implements Serializable {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = -4655498241575488134L;

	/** The id. */
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "id", unique = true, nullable = false)
	private Long id;

	/** The name. */
	@Column
	private String name;

	/** The content. */
	@Column
	private String content;

	/** The post. */
	@ManyToOne
	@JoinColumn(name = "idpost", nullable = false)
	private Post post;

}
