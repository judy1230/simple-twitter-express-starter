const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category


const adminService = {
	getRestaurants: (req, res, callback) => {
		return Restaurant.findAll({
			order: [
				['id', 'ASC'],
			],
			include: [Category]
		}).then(restaurants => {
			callback({
				restaurants: restaurants,
				user: req.user,
				isAuthenticated: req.isAuthenticated
			})
		})
	},
	getRestaurant: (req, res, callback) => {
		return Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => {
			callback({
				restaurant: restaurant
			})
		})
	},
	postRestaurant: (req, res, callback) => {
		if (!req.body.name) {
			callback({ status: 'error', message: "name doesn't exist" })

		}

		const { file } = req
		if (file) {
			imgur.setClientID(IMGUR_CLIENT_ID)
			imgur.upload(file.path, (err, img) => {
				return Restaurant.create({
					name: req.body.name,
					tel: req.body.tel,
					address: req.body.address,
					opening_hours: req.body.opening_hours,
					description: req.body.description,
					image: file ? img.data.link : null,
					CategoryId: req.body.categoryId
				}).then((restaurant) => {
					callback({ status: 'success', message: 'restaurant is successfully created' })

				})
			})

		} else {
			return Restaurant.create({
				name: req.body.name,
				tel: req.body.tel,
				address: req.body.address,
				opening_hours: req.opening_hours,
				description: req.body.description,
				image: null,
				CategoryId: req.body.categoryId
			})
				.then((restaurant) => {
					callback({ status: 'success', message: 'restaurant is successfully created' })

				})
		}

	},
	putRestaurant: (req, res, callback) => {
		if (!req.body.name) {
			callback({ status: 'error', message: "name didn't exist" })
			//req.flash('error_msg', "name didn't exist")
			//return res.redirect('back')
		}
		const { file } = req
		if (file) {
			imgur.setClientID(IMGUR_CLIENT_ID);
			imgur.upload(file.path, (err, img) => {
				return Restaurant.findByPk(req.params.id)
					.then((restaurant) => {
						restaurant.update({
							name: req.body.name,
							tel: req.body.tel,
							address: req.body.address,
							opening_hours: req.body.opening_hours,
							description: req.body.description,
							image: file ? img.data.link : restaurant.image,
							CategoryId: req.body.categoryId
						})
							.then((restaurant) => {
								callback({ status: 'success', message: 'restaurant was successfully to update' })
								//console.log('restaurant', restaurant)
								//req.flash('success_messages', 'restaurant was successfully to update')
								//	res.redirect('/admin/restaurants')
							})
					})
			})
		} else {
			return Restaurant.findByPk(req.params.id)
				.then((restaurant) => {
					restaurant.update({
						name: req.body.name,
						tel: req.body.tel,
						address: req.body.address,
						opening_hours: req.opening_hours,
						description: req.body.description,
						image: restaurant.image,
						CategoryId: req.body.categoryId
					})
						.then((restaurant) => {
							callback({ status: 'success', message: 'restaurant was successfully to update' })
							//req.flash('success_msg', 'restaurant was successfully to update')
							//res.redirect('/admin/restaurants')
						})
				})
		}

	},
	deleteRestaurant: (req, res, callback) => {
		return Restaurant.findByPk(req.params.id)
			.then((restaurant) => {
				restaurant.destroy()
					.then((restaurant) => {
						callback({ status: 'success', message: '' })
					})
			})
	},

}
module.exports = adminService
