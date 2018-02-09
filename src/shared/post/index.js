import React, { Component } from 'react'

export default class Post extends Component {
  render() {
	return (
	  <div>
			Create a Post
			<form>
				<label>
					Name:
					<input type="text" name="name" />
				</label>
				<input type="submit" value="Submit" />
			</form>
	  </div>
	)
  }
}
