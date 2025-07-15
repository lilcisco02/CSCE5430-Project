from flask import Flask, render_template, request, redirect, session
import sqlite3 as sql

app = Flask(__name__)
app.secret_key = "secret key" 

def get_db_connection():
    conn = sql.connect("Database.db")
    conn.row_factory = sql.Row
    return conn


@app.route("/")
def index():
    return render_template(
        "homepage.html", 
        username=session.get("email"), 
        role=session.get("role")
    )


@app.route("/login.html", methods = ["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        conn = get_db_connection()
        user = conn.execute("SELECT * FROM users WHERE email = ? AND  password = ?", (email, password)). fetchone()
        conn.close()

        if user:
            session["email"] = user["email"]
            session["role"] = user["role"]
            return redirect("/")
        else:
            return "Wrong email or password. Please try again"
    return render_template("login.html")
    
@app.route("/signup.html", methods = ["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form["name"].strip()
        email = request.form["email"].strip()
        password = request.form["password"].strip()
        confirm_password = request.form["confirm_password"].strip()
        role = request.form["role"].strip()

        if password != confirm_password:
            return "Passwords do not match"
        
        conn = get_db_connection()

        try:
            conn.execute(
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                (name, email, password, role)
            )
            conn.commit()
        except sql.IntegrityError as e:
            print("DB ERROR:", e)
            return "Database error:" + str(e)
        finally:
            conn.close()

        return redirect("/login.html")
    
    return render_template("signup.html")

@app.route("/homepage.html")
def homepage():
    if "email" in session:
        return render_template(
            "homepage.html", 
            username=session["email"],
            role=session.get("role"))
    
    return redirect("/")

@app.route("/Question.html")
def question():
    return render_template("Question.html")

@app.route("/python_tutorial.html")
def tutorial():
    return render_template("python_tutorial.html")

@app.route("/forgot-username.html")
def forgot_username():
    return render_template("forgot-username.html")

@app.route("/forgot-password.html")
def forgot_password():
    return render_template("forgot-password.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.route("/Administrator.html")
def administrator():
    if session.get("role") != "admin":
        return "Access Denied", 403
    return render_template("Administrator.html")

@app.route("/api/users")
def get_users():
    if session.get("role") != "admin":
        return {"error": "Access Denied"}, 403
    try:
        conn = get_db_connection()
        users = conn.execute("SELECT name, email, role FROM users").fetchall()
        conn.close()

        user_list = [
        {"name" : user["name"], "email": user["email"], "role":user["role"]}
        for user in users]
        print("Returning users: ", user_list)
        return {"users": user_list}
    except Exception as e:
        print("ERROR LOADING USERS:", e)  
        return {"error": "Server error"}, 500
    
@app.route("/HelpMe.html")
def HelpMe():
    return render_template("HelpMe.html")
if __name__ == "__main__":
    app.run(debug = True)