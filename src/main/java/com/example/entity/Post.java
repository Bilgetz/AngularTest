package com.example.entity;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.example.enums.State;

import lombok.Data;

/**
 * The Class Post.
 */
@Entity
@Data
public class Post implements Serializable {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 151012672910104285L;

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

	/** The note. */
	@Column
	private Integer note;

	@Enumerated(EnumType.STRING)
	@Column
	private State state;

	/** The category. */
	@ManyToOne
	@JoinColumn(name = "idcategory", nullable = false)
	private Category category;

	/** The comments. */
	@OneToMany(mappedBy = "post")
	private List<Comment> comments;

}
