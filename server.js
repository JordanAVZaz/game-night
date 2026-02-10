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
  const { rows } = await pool.query(`
    SELECT 
      p.id,
      p.name,
      COALESCE(SUM(
        CASE sr.placement
          WHEN 1 THEN 3
          WHEN 2 THEN 2
          WHEN 3 THEN 1
          ELSE 0
        END
      ),0) as score
    FROM players p
    LEFT JOIN session_results sr
      ON p.id = sr.player_id
    GROUP BY p.id
    ORDER BY score DESC;
  `)

  res.json(rows)
})

app.post("/games", async (req, res) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).send("Game name required")
  }

  const { rows } = await pool.query(
    `INSERT INTO games (name)
     VALUES ($1)
     RETURNING *`,
    [name]
  )

  res.json(rows[0])
})

app.get("/games", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM games ORDER BY name"
  )
  res.json(rows)
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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

