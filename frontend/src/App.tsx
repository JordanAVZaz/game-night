import { 
  Section,
  Theme, 
  Box, 
  ThemePanel,
  Flex,
  Text,
  Button,
  ScrollArea
 } from "@radix-ui/themes";

import { useEffect, useState } from "react"
import { GamesMenu } from "./sidebar/games";
import { Sessions, SessionsProvider } from "./sessions";
import {useDraggable, DragDropProvider} from '@dnd-kit/react';



type Player = {
  id: string
  name: string
  score: number
}

type Game = {
  id: string
  name: string
}


export const API = "https://game-night-r1oe.onrender.com"

export default function App() {
  const [players, setPlayers] = useState<Player[]>([])
  const [name, setName] = useState("")

  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState("")

  const [open, setOpen] = useState(false)
  const [placements, setPlacements] = useState<Record<string, number>>({})

  

  async function fetchPlayers() {
    const res = await fetch(`${API}/players`)
    const data = await res.json()
    setPlayers(data)
  }

  useEffect(() => {
  fetchPlayers()
}, [])

  useEffect(() => {
  fetch(`${API}/games`)
    .then(res => res.json())
    .then(setGames)
  }, [])

  useEffect(() => {
  const initial: Record<string, number> = {}

  players.forEach((p, i) => {
    initial[p.id] = i + 1
  })

  setPlacements(initial)
  }, [players])



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

  // async function updateScore(id: string, delta: number) {
  //   await fetch(`${API}/score`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ id, delta })
  //   })

  //   fetchPlayers()
  // }

async function createSession() {

  if (!selectedGame) {
    alert("Select a game first!")
    return
  }

  const results = players.map(p => ({
    playerId: p.id,
    placement: placements[p.id]
  }))

  await fetch(`${API}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      gameId: selectedGame,
      results
    })
  })

  setOpen(false)
  alert("Session saved 🎲")
  fetchPlayers()


}


	return (
    
     <Theme accentColor="iris" grayColor="mauve">
      <Flex height="100vh" width="100vw">
        {/* Sidebar */}
        <SessionsProvider>
        <Box width="250px" p="4" style={{ borderRight: "1px solid var(--gray-5)" }}>
          Games
          <GamesMenu></GamesMenu>
        </Box>

        {/* Main Content Column */}
        <Flex direction="column" flexGrow="1">

          {/* Header */}
          <Box p="4" style={{ borderBottom: "1px solid var(--gray-5)" }}>
            Header
          </Box>

          {/* Timeline (scrollable) */}
          <ScrollArea type="auto" style={{ flex: 1 }}>
            <Flex gap="3" direction="column" p="4">
            <Sessions></Sessions>
            </Flex>
          </ScrollArea>

          {/* Footer */}
          <Box p="4" style={{ borderTop: "1px solid var(--gray-5)" }}>
            Footer
          </Box>
        </Flex>
        </SessionsProvider>
      </Flex>
    </Theme>
	)



//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h3" sx={{ mt: 4 }}>
//         Game Night Leaderboard
//       </Typography>
//       <Button
//         variant="contained"
//         sx={{ mt: 2 }}
//         onClick={() => setOpen(true)}
//       >
//         Add Session
//       </Button>


//       <Stack direction="row" spacing={2} sx={{ my: 3 }}>
//         <TextField
//           label="Player name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           fullWidth
//         />

//         <Button variant="contained" onClick={createPlayer}>
//           Add
//         </Button>
//       </Stack>

//       <Stack spacing={2}>
//         {players.map((p) => (
//           <Card key={p.id}>
//             <CardContent>
//               <Typography variant="h6">
//                 {p.name} — {p.score}
//               </Typography>

//               {/* <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
//                 <Button
//                   variant="contained"
//                   onClick={() => updateScore(p.id, 1)}
//                 >
//                   +1
//                 </Button>

//                 <Button
//                   variant="outlined"
//                   onClick={() => updateScore(p.id, -1)}
//                 >
//                   -1
//                 </Button>
//               </Stack> */}
//             </CardContent>
//           </Card>
//         ))}
//       </Stack>
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
//   <DialogTitle>Create Session</DialogTitle>

//   <DialogContent>

//     {/* GAME SELECT */}
//     <Select
//       fullWidth
//       value={selectedGame}
//       onChange={(e) => setSelectedGame(e.target.value)}
//       sx={{ mt: 2 }}
//     >
//       {games.map((g: any) => (
//         <MenuItem key={g.id} value={g.id}>
//           {g.name}
//         </MenuItem>
//       ))}

//       <MenuItem
//         onClick={async () => {
//           const name = prompt("Enter game name")
//           if (!name) return

//           const res = await fetch(`${API}/games`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ name })
//           })

//           const newGame = await res.json()

//           setGames([...games, newGame])
//           setSelectedGame(newGame.id)
//         }}
//       >
//         ➕ Add Game
//       </MenuItem>

//     </Select>

//     {/* PLAYER RANKING */}
//     {players.map((p) => (
//       <Stack
//         direction="row"
//         spacing={2}
//         sx={{ mt: 2 }}
//         key={p.id}
//         alignItems="center"
//       >
//         <Typography sx={{ width: 120 }}>
//           {p.name}
//         </Typography>

//         <Select
//           value={placements[p.id] || 1}
//           onChange={(e) =>
//             setPlacements({
//               ...placements,
//               [p.id]: Number(e.target.value)
//             })
//           }
//         >
//           {[1,2,3,4].map((n) => (
//             <MenuItem key={n} value={n}>
//               {n}
//             </MenuItem>
//           ))}
//         </Select>
//       </Stack>
//     ))}

//   </DialogContent>

//   <DialogActions>
//     <Button onClick={() => setOpen(false)}>
//       Cancel
//     </Button>

//     <Button variant="contained" onClick={createSession}>
//       Commit
//     </Button>
//   </DialogActions>
// </Dialog>

//     </Container>
//   )
}
