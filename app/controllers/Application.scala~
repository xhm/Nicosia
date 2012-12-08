package controllers

import scala.util._
import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import models.Task
import play.api.mvc.BodyParsers.parse
import play.api.libs.json._
import play.api.libs.json.Json._
import play.api.libs.json.Writes._
import org.joda.time._

object Application extends Controller {

  def index = Action { request =>
    Ok(views.html.index("My first Play! app."))
  }

  def photoDetail = Action(parse.json) { request => 
    (request.body \ "dateString").asOpt[String].map { dateString =>
      val date = new DateTime(dateString toLong)
      Ok(toJson(
        Map("Lat" -> -34, "Lng" -> 147)
        //Map("date" -> date.year().get())
      ))
    }.getOrElse {
      BadRequest(toJson(
        Map("date" -> "Missing parameter [dateString]")
      ))
    }
  }
}
