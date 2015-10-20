package com.example.controller;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.builder.EntitySpecificationsBuilder;
import com.example.entity.Post;

/**
 * The Class PostRestController.
 */
@RepositoryRestController
public class PostRestController {

	/** The post reposiroty. */
	private JpaSpecificationExecutor<Post> repository;

	/** The paged resources assembler. */
	private PagedResourcesAssembler pagedResourcesAssembler;

	/**
	 * Instantiates a new post rest controller.
	 *
	 * @param postReposiroty
	 *            the post reposiroty
	 * @param pagedResourcesAssembler
	 *            the paged resources assembler
	 */
	@Autowired
	public PostRestController(JpaSpecificationExecutor<Post> postReposiroty,
			PagedResourcesAssembler pagedResourcesAssembler) {
		super();
		this.repository = postReposiroty;
		this.pagedResourcesAssembler = pagedResourcesAssembler;
	}

	/**
	 * Gets the.
	 *
	 * @param search
	 *            the search
	 * @param pageable
	 *            the pageable
	 * @param resourceAssembler
	 *            the resource assembler
	 * @return the paged resources
	 */
	@RequestMapping(value = "/posts/search/findByCriteria", method = RequestMethod.GET)
	public @ResponseBody PagedResources<PersistentEntityResource> get(
			@RequestParam(value = "search", required = false) String search, Pageable pageable,
			PersistentEntityResourceAssembler resourceAssembler) {
		// http://stackoverflow.com/questions/26538156/can-i-make-a-custom-controller-mirror-the-formatting-of-spring-data-rest-sprin/29924387#29924387
		EntitySpecificationsBuilder<Post> builder = new EntitySpecificationsBuilder<Post>();

		if (StringUtils.isNoneBlank(search)) {
			Pattern pattern = Pattern.compile("(\\w+?)(:|<|>)(\\w+?),");
			Matcher matcher = pattern.matcher(search); // + ","
			while (matcher.find()) {
				builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
			}
		}

		Specification<Post> spec = builder.build();

		Page<Post> posts = this.repository.findAll(spec, pageable);

		return pagedResourcesAssembler.toResource(posts, resourceAssembler);

	}

}
