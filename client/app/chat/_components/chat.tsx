"use client"

import {useFetch} from "@/lib/hooks/use-fetch";
import {useSocket} from "@/app/chat/_components/use-socket";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input";
import {SendHorizontal} from "lucide-react";

export function Chat() {
  const {data} = useFetch("/group")
  const {socket} = useSocket({autoConnect: false})


  const onConnect = () => {
    socket.connect()

    socket.on("connect", async () => {
      console.log('connect')
    })

    socket.emit("message", {test: "test"})

  }

  return (
    <Card className="flex flex-col w-[min(100%,500px)] h-[calc(100vh-9.5rem)] relative">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[calc(100vh-18.5rem)]">
        <Card className="flex-grow overflow-y-scroll p-2">
          {/*<div>*/}
          {/*  <Button onClick={onConnect}>*/}
          {/*    connect*/}
          {/*  </Button>*/}
          {/*</div>*/}
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque dolor est eveniet exercitationem, nam porro quis quisquam, ratione rerum vel veniam vero voluptate. Fuga magnam provident reiciendis? Ab, ea, ullam.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci asperiores aspernatur cupiditate, deserunt eius exercitationem harum illo inventore itaque nam nesciunt odio odit provident quod quos sequi voluptate voluptatem?
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, cumque dolor eveniet fuga fugiat impedit labore non nostrum optio quia ratione rem, soluta, tempora tempore ullam voluptatem voluptatum. Dolorum, non.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet fugit molestiae perferendis provident sint. Ad blanditiis commodi culpa, delectus eligendi et impedit ipsum laborum nam quaerat quod tempora. Ducimus, quos.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium blanditiis consequuntur ex facilis minima minus non pariatur quam, sed sit, soluta unde! Accusamus dicta eveniet, illum iusto molestias perferendis possimus.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A animi consectetur consequatur dolore dolorum ea earum ipsam ipsum laboriosam modi, neque nihil, omnis perferendis quae quaerat quisquam repellat, rerum sequi.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. At cum dolore eaque hic quia, repudiandae similique. Aliquid animi debitis delectus deserunt dolore eaque laborum, nostrum placeat possimus, rem sit voluptatem!
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur culpa eaque eos iusto optio sunt tempore. Animi, atque culpa deleniti dolore dolorum eius maxime necessitatibus neque, nostrum, officiis reprehenderit repudiandae.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi consectetur consequatur ea esse iure numquam officia porro quia? Aliquam architecto consectetur cum exercitationem fuga illum itaque, nemo sunt voluptatibus voluptatum!
        </Card>
      </CardContent>
      <CardFooter className="gap-2 absolute w-full bottom-0">
        <Input/>
        <Button className="" size="icon">
          <SendHorizontal />
        </Button>
      </CardFooter>
    </Card>
  )
}
