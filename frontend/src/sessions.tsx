import {
  Box,
  Flex,
  Text,
  TextField,
  Button,
  ScrollArea,
  Card,
  Avatar,
  Dialog,
  Inset,
  Heading,
} from "@radix-ui/themes";
import React, {useRef, useState, useEffect} from 'react';
import { createContext, useContext } from "react";
import {useDraggable, DragDropProvider} from '@dnd-kit/react';
import type { JSX } from "react";
import {useSortable} from '@dnd-kit/react/sortable';
import {move} from '@dnd-kit/helpers'
import { LockClosedIcon, LockOpen1Icon, Cross1Icon } from "@radix-ui/react-icons";
import { API } from "./App";


type RankingColors = "gold" | "gray" | "bronze" | "mint";

// const rankColorAssignment = (id:number):RankingColors => {
//   switch(id){
//     case 1: return "gold"
//     case 2: return "gray"
//     case 3: return "bronze"
//     default: return "sky"
//   }
// } 

function RankIcon({index}: {index: number}) {
  
  let c:RankingColors = "gray"
  let variant:"solid" | "soft" | undefined = "solid"
  const idx = index+1

  switch(idx){
    case 1: c = "gold"
    break
    case 2: c = "gray"
    break
    case 3: c = "bronze"
    break
    default: variant = "soft"
  }
     return(
      <Avatar size="3" radius="full" fallback={idx} color={c} variant={variant} className="ml-auto!"/> )
  
} 

function Sortable({id, index}: {id: string; index: number}) {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const {isDragging} = useSortable({id, index, element, handle: handleRef});

  return (
    <li ref={setElement} className="item" data-shadow={isDragging || undefined}>
      {/* <button ref={handleRef} className="handle">{id} {index + 1}</button> */}
      <Card size="2" asChild className="w-40!" >
      <button ref={handleRef} className="">
      <Flex maxHeight={"100px"} >
        <Text>
        {id}
        </Text>
      <RankIcon index={index}/>
      </Flex>
		</button>
      </Card>
    </li>
  );
}

function Lock({lock, setLock}:{lock:Boolean,setLock:React.Dispatch<React.SetStateAction<boolean>>}) {

  return (
    <Button m={'2'} onClick={() => {setLock(prev => !prev)}}variant={lock ? "soft" : "solid"}>
      {lock ? <LockOpen1Icon /> : <LockClosedIcon />}
    </Button>
  );
}

export function Session({session}:{session:SessionType}){

    const [items, setItems] = useState(["Hadeel","Jordan","Salma","Arslan"]);
    const [lock, setLock] = useState(true);
    const {deleteSession} = useSessions()

    return(
      
        <Box ml="9" width="350px" className="">
          <Card size="2" className="!flex !items-center flex-col justify-center shadow-md bg-linear-60 from-indigo-500/40 to-blue-400/5" >
					<Flex mb={'2'} width={'100%'}>
          <Text color="iris" weight={'light'} size={'1'} className="mr-auto">
            {session.date}</Text>
          <Button onClick={() => {if(lock)deleteSession(session); }} variant="ghost" className="ml-auto!">
            <Cross1Icon/>
          </Button>
          </Flex>
          <Heading as="h2" size="8" weight="bold">
						{session.name} 
					</Heading>
          <Heading as="h3" size="4" color="iris" weight={"light"} >
						Season 1
					</Heading>
          <Text mt={'4'} as="div" size="4" color="gold" weight={"regular"} className="">
						Results:
					</Text>
          <Box p={'1'} className="!flex !items-center !justify-center">
					
          <Box maxWidth={"250px"} p={"2"}>
            <Card>
          <DragDropProvider
            onDragMove={(event) => {
              setItems((items) => move(items, event));
            }}>
            <ul className="list">
              {items.map((id, index) => (
                <Sortable key={id} id={id} index={index} />
              ))}
            </ul>
          </DragDropProvider>
          </Card>
          </Box>
          </Box>
          <Lock lock={lock} setLock={setLock}/>
          </Card>
				</Box>

    )
}

export type SessionType = {
  id: number
  date:string
  name:string
}

export type SessionsContextType = {
  sessions: SessionType[];
  addSession: (s: SessionType) => void;
  deleteSession: (s: SessionType) => void;
};

const SessionsContext = createContext<SessionsContextType | null>(null);

export function SessionsProvider({ children }: { children: React.ReactNode }) {
  // const [sessions, setSessions] = useState<number[]>([]);
  const [sessions, setSessions] = useState<SessionType[]>([])

  const addSession = (s: SessionType) =>
    setSessions(prev => [...prev, s]);

  const deleteSession = (s: SessionType) =>
    setSessions(prev => prev.filter(ss => ss.id !== s.id));

  return (
    <SessionsContext.Provider value={{ sessions, addSession, deleteSession }}>
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionsContext);
  if (!context) throw new Error("Must be inside SessionsProvider");
  return context;
}


type Player = {
  id: string
  name: string
  score: number
}

type Game = {
  id: string
  name: string
}


export function Sessions() {
  
  const { addSession, sessions } = useSessions()
  
  return (
    <div className="flex flex-col gap-4 w-3xs">
      {/* <Button
        onClick={() =>
          // setSessions(prev => [...prev, Date.now()])
          addSession(Date.now())
        }
      >
        + New Session
      </Button> */}
      <Text> Season 1 - 2026</Text>
      {sessions.slice(0).reverse().map(s => (
        <Session key={s.id} session={s} />
      ))}
    </div>
  );
}