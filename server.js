import express from "express"
import pkg from "pg"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pkg

const app = express()
app.use(cors({
  origin: "*"
}))
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4
})

app.get("/players", async (_, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM players ORDER BY score DESC"
  )
  res.json(rows)
})

app.post("/players", async (req, res) => {
  const { name } = req.body

  const { rows } = await pool.query(
    "INSERT INTO players(name) VALUES($1) RETURNING *",
    [name]
  )

  res.json(rows[0])
})

app.post("/score", async (req, res) => {
  const { id, delta } = req.body

  const { rows } = await pool.query(
    `UPDATE players
     SET score = GREATEST(score + $1, 0)
     WHERE id = $2
     RETURNING *`,
    [delta, id]
  )

  res.json(rows[0])
})

app.listen(3000, () =>
  console.log("Server running on port 3000")
)
