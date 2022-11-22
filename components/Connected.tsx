import {
  Button,
  Container,
  Heading,
  VStack,
  Text,
  HStack,
  Image,
} from "@chakra-ui/react"
import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { PublicKey } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
  Metaplex,
  walletAdapterIdentity,
  CandyMachine,
  CandyMachineV2
} from "@metaplex-foundation/js"
import { useRouter } from "next/router"

const Connected: FC = () => {
  const { connection } = useConnection()
  const walletAdapter = useWallet()
  const [candyMachine, setCandyMachine] = useState<CandyMachineV2>()
  const [isMinting, setIsMinting] = useState(false)

  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
  }, [connection, walletAdapter])

  useEffect(() => {
    if (!metaplex) return

    metaplex
      .candyMachinesV2()
      .findByAddress({
        address: new PublicKey("Hk7c6H4jPZNVg5Nj9qLwTKNksrVjEQr9TN5cMCw48Kid"),
      })
      .then((candyMachine) => {
        console.log(candyMachine)
        setCandyMachine(candyMachine)
      })
      .catch((error) => {
        alert(error)
      })
  }, [metaplex])

  const router = useRouter()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      if (event.defaultPrevented) return

      if (!walletAdapter.connected || !candyMachine) {
        return
      }

      try {
        setIsMinting(true)
        const nft = await metaplex.candyMachinesV2().mint({
          candyMachine,
    });
        console.log(nft)
        router.push(`/newMint?mint=${nft.nft.address.toBase58()}`)
      } catch (error) {
        alert(error)
      } finally {
        setIsMinting(false)
      }
    },
    [walletAdapter.connected, candyMachine, metaplex, router]
  )

  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="purple"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome Hiphop Cat
          </Heading>

          <Text color="black" fontSize="xl" textAlign="center">
            Each Cat is randomly generated and can be staked to receive
            <Text as="b"> $TRC</Text>. Use your <Text as="b"> $TRC</Text> to
            upgrade your HipHop Cat and receive perks within the community!
          </Text>
        </VStack>
      </Container>

      <HStack spacing={10}>
        <Image src="0.png" alt=""  boxSize='200px'/>
        <Image src="1.png" alt=""  boxSize='200px'/>
        <Image src="2.png" alt=""  boxSize='200px'/>
        <Image src="3.png" alt=""  boxSize='200px'/>
        <Image src="5.png" alt=""  boxSize='200px'/>
      </HStack>

      <Button
        bgColor="accent"
        color="white"
        maxW="380px"
        onClick={handleClick}
        isLoading={isMinting}
      >
        <Text>mint Hip Hop Cat</Text>
      </Button>
    </VStack>
  )
}

export default Connected