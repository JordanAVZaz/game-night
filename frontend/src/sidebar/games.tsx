import {
  Box,
  Flex,
  Text,
  TextField,
  Button,
  ScrollArea,
  Card,
  Dialog,
} from "@radix-ui/themes";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as Accordion from '@radix-ui/react-accordion';
import React, { useState, useEffect } from "react";
import { Value } from "@radix-ui/themes/components/data-list";
import { Session, useSessions } from "../sessions";
import type {SessionsContextType, SessionType} from '../sessions'
import { API } from "../App";

type RadixColor = React.ComponentProps<typeof Button>["color"];

type GameDialogProps = {
    setGameName: React.Dispatch<React.SetStateAction<string>>
    modGame: () => void
    color: RadixColor
    buttonName: string
    dialogName: string
    dialogDescription: string
    placeHolder: string
}

export function GameSettingButton({
    setGameName,
    modGame,
    color = "blue",
    buttonName = "+ Add Game",
    dialogName = "Add a new Game",
    dialogDescription = "Add a Game to the Library",
    placeHolder = "Add Game..."
    }: GameDialogProps) 
{
    
    return(
     <Dialog.Root>
        <Dialog.Trigger>
            {/* Add Button */}
            <Button color={color}
             variant="soft"
             className="justify-start!">{buttonName}</Button>
      </Dialog.Trigger>
	    <Dialog.Content maxWidth="450px">
        	<Dialog.Title>{dialogName}</Dialog.Title>
            <Dialog.Description size="2" mb="4">
                {dialogDescription}
            </Dialog.Description>
            <Flex direction="column" gap="3">
			<label>
				<Text as="div" size="2" mb="1" weight="bold">
					Name
				</Text>
				<TextField.Root
					defaultValue=""
					placeholder={placeHolder}
                    onChange={(e) => setGameName(e.target.value)}
				/>
			</label>
		</Flex>
        <Flex gap="3" mt="4" justify="end">
			<Dialog.Close>
				<Button variant="soft" color="gray">
					Cancel
				</Button>
			</Dialog.Close>
			<Dialog.Close>
				<Button onClick={modGame}>Save</Button>
			</Dialog.Close>
		</Flex>

      </Dialog.Content>
    </Dialog.Root>
    )
}

export function GamesMenu() {
    const [newGameName, setNewGameName] = useState("");
    const [deleteGameSelect, setDeleteGameSelect] = useState("");
    const [search, setSearch] = useState("");
    const [games, setGames] = useState([
    "Chess",
    "Timeline Wars",
    "Castle Deck",
    "Era of Conquest",
    "Celestia"
    ]);
    const { addSession, sessions } = useSessions()

    const [timerFlag, setTimerFlag] = useState<string|undefined>(undefined)
    
    useEffect(() => {
        // console.log(timerFlag+'<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
        if (!timerFlag) return;

        const timer = setTimeout(() => {
        setTimerFlag(undefined);
        }, 10000);

        return () => clearTimeout(timer);
    }, [timerFlag]);

    const filteredGames = games.filter((game) =>
    game.toLowerCase().includes(search.toLowerCase())
    );
  

    const addGame = () => {
        const game = newGameName.trim().toLowerCase();
        if (game === "") return;

        const exists = games.some(
        (g) => g.toLowerCase() === game
        );

        if (exists) return;

        setGames(prev => [...prev, game]);
        setNewGameName("");
    };

    const deleteGame = () => {
        const game = deleteGameSelect.trim().toLowerCase();
        if (game === "") return;

        const exists = games.some(
        (g) => g.toLowerCase() === game);

        if (!exists) return;

        setGames(prev => prev.filter(g => g !== game));
        setDeleteGameSelect("");
    };

    async function createSession(game:string, results:{playerId:string,placement:number}) {
    
      await fetch(`${API}/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gameId: game,
          results
        })
      })
    }

  return (
    <Flex direction="column" height="100%" p="3" gap="3">
    <Accordion.Root type="single"
    value={timerFlag ?? ""} // always passing through value to trigger flag, can be unreliable without it
     onValueChange={setTimerFlag} className="rounded-b-md  text-sm/4 " collapsible>
	<Accordion.Item value="item-1">
        <Accordion.Trigger
        className="group w-full rounded-none! text-left!
                    flex items-center justify-between bg-amber-50/0!"
        style={{ borderBottom: "1px solid var(--gray-5)" }}
        >
            <span>Game Library: Add/Delete</span>

            <ChevronDownIcon 
                className="transition-transform duration-300 
                        group-data-[state=open]:rotate-180"
            />
            </Accordion.Trigger>
        <Accordion.Content className=" flex flex-col gap-2 pr-[5%] pt-[5%] pl-[5%] pb-[5%] ![&>*]:bg-transparent" >
            <GameSettingButton
                setGameName={setNewGameName}
                modGame={addGame} 
                color={"blue"} 
                buttonName={"+ Add Game"} 
                dialogName={"Add a Game to the Library"} 
                dialogDescription={"Add a Game to the Library"}
                placeHolder="Add Game..."></GameSettingButton>
                <GameSettingButton
                setGameName={setDeleteGameSelect}
                modGame={deleteGame} 
                color={"red"} 
                buttonName={"+ Delete Game"} 
                dialogName={"(Caution) Delete game permanantly"} 
                dialogDescription={"Type the game you want to delete, all data will be lost"}
                placeHolder="Delete Game..."></GameSettingButton>
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>


      {/* Search Bar */}
      <TextField.Root 
      placeholder="Search games..." 
      value={search}
      onChange={(e) => setSearch(e.target.value)}>
      </TextField.Root>

      {/* Game List */}
      <ScrollArea type="auto" style={{ flex: 1 }}>
        <Flex direction="column" gap="2">
          {filteredGames.map((game, index) => (
            <Card key={index} size="1">

                  <div className="flex flex-col gap-4">
                      <Button
                        onClick={() =>
                          addSession({
                            id:Date.now(),
                            date:"0",
                            name:game    
                        })
                        }
                      >
                        + New Session
                      </Button>
                    </div>


              <Text size="3" weight={'bold'}>{game}</Text>
            </Card>
          ))}
        </Flex>
      </ScrollArea>

    </Flex>
  );
}
