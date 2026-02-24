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
import React, {useRef, useState} from 'react';
import {useDraggable, DragDropProvider} from '@dnd-kit/react';
import type { JSX } from "react";
import {useSortable} from '@dnd-kit/react/sortable';
import {move} from '@dnd-kit/helpers'
import { LockClosedIcon, LockOpen1Icon, Cross1Icon } from "@radix-ui/react-icons";


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

function Lock() {
  const [lock, setLock] = useState(true);

  return (
    <Button m={'2'} onClick={() => setLock(prev => !prev)}variant={lock ? "soft" : "solid"}>
      {lock ? <LockOpen1Icon /> : <LockClosedIcon />}
    </Button>
  );
}

export function Session(){

    const [items, setItems] = useState(["Hadeel","Jordan","Salma","Arslan"]);

    return(
        <Box ml="9" width="350px" className="">
          <Card size="2" className="!flex !items-center flex-col justify-center shadow-md bg-linear-60 from-indigo-500/40 to-blue-400/5" >
					<Flex mb={'2'} width={'100%'}>
          <Text color="iris" weight={'light'} size={'1'} className="mr-auto">12/05/1992</Text>
          <Button variant="ghost" className="ml-auto!">
            <Cross1Icon/>
          </Button>
          </Flex>
          <Heading as="h2" size="8" weight="bold">
						Catan 
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
          <Lock />
          </Card>
				</Box>

    )
}

export function Sessions() {
  const [sessions, setSessions] = useState<number[]>([]);

  return (
    <div className="flex flex-col gap-4 w-3xs">
      <Button
        onClick={() =>
          setSessions(prev => [...prev, Date.now()])
        }
      >
        + New Session
      </Button>

      {sessions.slice(0).reverse().map(id => (
        <Session key={id} />
      ))}
    </div>
  );
}