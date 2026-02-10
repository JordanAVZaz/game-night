import { useEffect, useState } from "react"
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack
} from "@mui/material"

type Player = {
  id: string
  name: string
  score: number
}

export const API = "https://game-night-r1oe.onrender.com"

export default function App() {
  const [players, setPlayers] = useState<Player[]>([])
  const [name, setName] = useState("")

  async function fetchPlayers() {
    const res = await fetch(`${API}/players`)
    const data = await res.json()
    setPlayers(data)
  }

  useEffect(() => {
    fetchPlayers()
  }, [])

  async function createPlayer() {
    if (!name) return

    await fetch(`${API}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    })

    setName("")
    fetchPlayers()
  }

  async function updateScore(id: string, delta: number) {
    await fetch(`${API}/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, delta })
    })

    fetchPlayers()
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" sx={{ mt: 4 }}>
        Game Night Leaderboard
      </Typography>

      <Stack direction="row" spacing={2} sx={{ my: 3 }}>
        <TextField
          label="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />

        <Button variant="contained" onClick={createPlayer}>
          Add
        </Button>
      </Stack>

      <Stack spacing={2}>
        {players.map((p) => (
          <Card key={p.id}>
            <CardContent>
              <Typography variant="h6">
                {p.name} — {p.score}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => updateScore(p.id, 1)}
                >
                  +1
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => updateScore(p.id, -1)}
                >
                  -1
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  )
}
