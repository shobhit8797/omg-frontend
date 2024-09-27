import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { VideoCard } from "../VideoCard";
import { BASE_URL } from "@/config";

type RoomProps = {
    name: string;
    localAudioTrack: MediaStreamTrack | null;
    localVideoTrack: MediaStreamTrack | null;
};

type OfferPayload = {
    roomId: string;
    sdp: RTCSessionDescriptionInit;
};

type IceCandidatePayload = {
    candidate: RTCIceCandidate;
    type: "sender" | "receiver";
    roomId: string;
};

export const Room = ({ name, localAudioTrack, localVideoTrack }: RoomProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [sendingPc, setSendingPc] = useState<RTCPeerConnection | null>(null);
    const [receivingPc, setReceivingPc] = useState<RTCPeerConnection | null>(
        null
    );
    const [remoteVideoTrack, setRemoteVideoTrack] =
        useState<MediaStreamTrack | null>(null);
    const [remoteAudioTrack, setRemoteAudioTrack] =
        useState<MediaStreamTrack | null>(null);
    const [remoteMediaStream, setRemoteMediaStream] =
        useState<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const socket = io(BASE_URL);

        socket.on("send-offer", async ({ roomId }: { roomId: string }) => {
            console.log("received send-offer for", socket.id);
            const pc = new RTCPeerConnection();

            setSendingPc(pc);
            if (localVideoTrack) {
                pc.addTrack(localVideoTrack);
            }
            if (localAudioTrack) {
                pc.addTrack(localAudioTrack);
            }

            pc.onicecandidate = async (e) => {
                if (e.candidate) {
                    socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type: "sender",
                        roomId,
                    });
                }
            };

            pc.onnegotiationneeded = async () => {
                const sdp = await pc.createOffer();
                pc.setLocalDescription(sdp);

                socket.emit("offer", {
                    sdp,
                    roomId,
                });
            };
        });

        socket.on("offer", async ({ roomId, sdp: remoteSdp }: OfferPayload) => {
            console.log("received offer for socket id", socket.id);
            const pc = new RTCPeerConnection();
            await pc.setRemoteDescription(remoteSdp);
            const sdp = await pc.createAnswer();
            await pc.setLocalDescription(sdp);

            const stream = new MediaStream();
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }
            setRemoteMediaStream(stream);
            setReceivingPc(pc);

            pc.ontrack = (e) => {
                // Add track to the media stream
                if (remoteVideoRef.current && e.track) {
                    remoteVideoRef.current.srcObject?.addTrack(e.track);
                }
            };

            pc.onicecandidate = async (e) => {
                if (e.candidate) {
                    socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type: "receiver",
                        roomId,
                    });
                }
            };

            socket.emit("answer", {
                roomId,
                sdp: sdp,
            });

            setTimeout(() => {
                const track1 = pc.getTransceivers()[0].receiver.track;
                const track2 = pc.getTransceivers()[1].receiver.track;
                if (track1.kind === "video") {
                    setRemoteAudioTrack(track2);
                    setRemoteVideoTrack(track1);
                } else {
                    setRemoteAudioTrack(track1);
                    setRemoteVideoTrack(track2);
                }
                remoteVideoRef.current?.srcObject?.addTrack(track1);
                remoteVideoRef.current?.srcObject?.addTrack(track2);
            }, 5000);
        });

        socket.on("answer", ({ sdp: remoteSdp }: OfferPayload) => {
            setSendingPc((pc) => {
                pc?.setRemoteDescription(remoteSdp);
                return pc;
            });
        });

        socket.on(
            "add-ice-candidate",
            ({ candidate, type }: IceCandidatePayload) => {
                if (type === "sender") {
                    setReceivingPc((pc) => {
                        pc?.addIceCandidate(candidate);
                        return pc;
                    });
                } else {
                    setSendingPc((pc) => {
                        pc?.addIceCandidate(candidate);
                        return pc;
                    });
                }
            }
        );

        setSocket(socket);
        return () => {
            socket.disconnect();
        };
    }, [name]);

    useEffect(() => {
        if (localVideoRef.current) {
            if (localVideoTrack) {
                localVideoRef.current.srcObject = new MediaStream([
                    localVideoTrack,
                ]);
            }
        }
    }, [localVideoTrack]);

    return (
        <>
            <ResizablePanelGroup
                direction="horizontal"
                className="w-full rounded-lg border"
            >
                <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={50}>
                            <VideoCard
                                videoRef={remoteVideoRef}
                                className="h-full"
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={50}>
                            <VideoCard
                                videoRef={localVideoRef}
                                className="h-full"
                            />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                    <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">Chat Screen</span>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
};
