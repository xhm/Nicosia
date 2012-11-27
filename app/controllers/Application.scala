package controllers

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import models.Task
import play.api.mvc.BodyParsers.parse

object Application extends Controller {

  def index = Action { request =>
    Ok(views.html.index("My first Play! app."))
  }

  def tasks = Action {
    Ok("TODO")
  }
}
