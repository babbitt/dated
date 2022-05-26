import React from "react"
import "./editor.css"

import { ToastContainer, toast, Slide } from 'react-toastify';
import Peer from 'peerjs';
import copy from 'copy-to-clipboard';

import EditorJS from '@editorjs/editorjs';

import lz from "lzutf8";

import { UserButton } from './menu/Button'

import ImageTool from '@editorjs/image';
import uploader  from '@ajite/editorjs-image-base64';
import inlineComment from './inlineComment'
import { ActionBar } from "./menu/actionBar";
const Header = require('editorjs-header-with-anchor');
const AlignmentTuneTool = require('editorjs-text-alignment-blocktune');
const Delimiter = require('@editorjs/delimiter');





export const Editor = ({user}) => {
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    const fileSystemInfo = {}
    const errorHandler = (err) => {
        console.log("BRTTT", err)
    }


    const USER = user

    const peer = new Peer()

    let editorData = {
        "time": 1626836620955,
        "blocks": [
            {
                "id": "e-28ktKcGN",
                "type": "header",
                "data": {
                    "text": "Dated",
                    "level": 1,
                    "anchor": ""
                }
            },
            {
                "id": "BkNgXyQQYw",
                "type": "paragraph",
                "data": {
                    "text": "your shared relationship journal"
                }
            }
        ],
        "version": "2.22.1"
    }
    let ReceivingData = false
    let totalBlocksIn = -1

    peer.on('connection', function(conn) {
        conn.on('data', function(data){
            if (data["type"] == "block") {
                if (data["index"] == 0) editorData["blocks"] = []
                editorData["blocks"][data["index"]] = data["block"]
                if (data["index"] % 5 == 0) {
                    toast.warning(`Got block ${parseInt(data["index"])+1}/${totalBlocksIn}`, {
                        position: "top-center",
                        transition: Slide,
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
                if (parseInt(data["index"])+1 == totalBlocksIn-1) {
                    totalBlocksIn = -1
                    toast.warning("All blocks received, loading new editor", {
                        position: "top-center",
                        transition: Slide,
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    editor = new EditorJS({
                        holder: 'editor',
                        tools: {
                            alignmentTune: {
                                class: AlignmentTuneTool,
                            },
                            header: {
                                class: Header,
                                shortcut: 'CMD+SHIFT+H',
                                tunes: ['alignmentTune'],
                                config: {
                                    defaultLevel: 1,
                                }
                            },
                            image: {
                                class: ImageTool,
                                config: {
                                    uploader
                                }
                            },
                            delimiter: {
                                class: Delimiter,
                                shortcut: 'CMD+SHIFT+D'
                            },
                            inlineComment: {
                                class: inlineComment,
                                shortcut: 'CMD+SHIFT+M',
                                config: {
                                    user: USER,
                                }
                            },
                        },
                        data : editorData
                        
                    });
                }
            } else if (data["type"] == "meta") {
                editorData = {...editorData, ...data["data"]}
                totalBlocksIn = parseInt(data["totalNum"])
                toast.warning(`Incoming data transmission... \n 1/${totalBlocksIn}`, {
                    position: "top-center",
                    transition: Slide,
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                document.querySelector('#editor').innerHTML = ""
            }
        console.log(editorData)
        });
    });

    const copyPeerId = () => {
        copy(peer.id);
        toast.success("Peer ID copied to clipboard", {
            position: "top-center",
            transition: Slide,
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }

    const sendData = () => {
        const npeer = document.querySelector('#companionID').value
        if (npeer === "" ) return
        var conn = peer.connect(npeer);
        // on open will be launch when you successfully connect to PeerServer
        conn.on('open', function(){
        // here you have conn.id
            editor.save().then((outputData) => {
                console.log(outputData)
                const blocks = [...outputData["blocks"]]
                delete outputData["blocks"]
                conn.send({
                    "type": "meta",
                    "data": outputData,
                    "totalNum": 1+blocks.length,
                })
                console.log("Sent meta")
                console.log(outputData)
                console.log(blocks)
                for(const block in blocks){
                    console.log(blocks[block])
                    conn.send({
                        "type": "block",
                        "index": block,
                        "block": blocks[block]
                    })
                }
                // conn.send(outputData);
            });
        });
    }

    const initFileSystem = (successCallback, size=1024*1024) => {
        navigator.webkitPersistentStorage.requestQuota(size, function(grantedBytes) {
                fileSystemInfo.grantedBytes = grantedBytes
                successCallback()
            }, function(e) {
                console.log('Error', e);
        });
    }


    try {
        initFileSystem(() => {
            window.requestFileSystem(navigator.webkitPersistentStorage.PERSISTENT, fileSystemInfo.grantedBytes, (fs) => {
                fs.root.getFile('journal.json', {create: true}, function(fileEntry) {

                    // Get a File object representing the file,
                    // then use FileReader to read its contents.
                    fileEntry.file(function(file) {
                        var reader = new FileReader();
                
                        reader.onloadend = function(e) {
                            try {
                                editorData = JSON.parse(this.result)
                            }
                            catch {
                                console.log("JSON Load Failed")
                            }
                            loadEditor()
                        };
                
                        reader.readAsText(file);
                    }, errorHandler);
                
                }, errorHandler);
            }, errorHandler);
        },parseInt(localStorage.getItem('requiredSize')))
    }
    catch {
        console.log("Couldn't load initial data")
    }

    let editor;

    const loadEditor = () => {
        editor = new EditorJS({
            holder: 'editor',
            tools: {
                alignmentTune: {
                    class: AlignmentTuneTool,
                },
                header: {
                    class: Header,
                    shortcut: 'CMD+SHIFT+H',
                    tunes: ['alignmentTune'],
                    config: {
                        defaultLevel: 1,
                    }
                },
                image: {
                    class: ImageTool,
                    config: {
                        uploader
                    }
                },
                delimiter: {
                    class: Delimiter,
                    shortcut: 'CMD+SHIFT+D'
                },
                inlineComment: {
                    class: inlineComment,
                    shortcut: 'CMD+SHIFT+M',
                    config: {
                        user: USER,
                    }
                },
            },
            data : editorData
            
        });
    }

    const saveEditorState = () => {
        let outputJson;
        let requiredSize = 1024*1024;


        const saveFile = (fs) => {

            fs.root.getFile('journal.json', {}, (fileEntry) => {
                fileEntry.remove(function() {
                    console.log('File removed.');
                    fs.root.getFile('journal.json', {create: true}, function(fileEntry) {


                        // Create a FileWriter object for our FileEntry (log.txt).
                        fileEntry.createWriter(function(fileWriter) {
                    
                            fileWriter.onwriteend = function(e) {
                                console.log('Write completed.');
                                toast.success("File saved to disk", {
                                    position: "top-center",
                                    transition: Slide,
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                });
                            };
                        
                            fileWriter.onerror = function(e) {
                                console.log('Write failed: ' + e.toString());
                            };
                        
                            // Create a new Blob and write it to log.txt.
                            var blob = new Blob([JSON.stringify(outputJson)], {type: 'application/json'});
                        
                            fileWriter.write(blob);
                    
                        }, errorHandler);
                    
                    }, errorHandler);
                }, errorHandler);
            })
          
          }

        editor.save().then((outputData) => {
            console.log('Article data: ', outputData)
            outputJson = outputData
            requiredSize =  new Blob([JSON.stringify(outputJson)], {type: 'application/json'}).size
            localStorage.setItem('requiredSize', requiredSize.toString())
            initFileSystem(()=>{
                window.requestFileSystem(navigator.webkitPersistentStorage.PERSISTENT, fileSystemInfo.grantedBytes, saveFile, errorHandler);
            },requiredSize)
            // localStorage.setItem('editorData', lz.encodeBase64(lz.compress(JSON.stringify(outputData))))
          }).catch((error) => {
            console.log('Saving failed: ', error)
          });
    }

    const SaveEditorToFile = () => {
        
    }

    return (
        <div style={{position: 'relative'}}>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,200;0,400;1,200;1,400&family=Yomogi&display=swap" rel="stylesheet"/>
            <ActionBar sendData={sendData} copyPeerId={copyPeerId} saveEditorState={saveEditorState} SaveEditorToFile={SaveEditorToFile} />
            <div id="editor">
            </div>
            <ToastContainer />
        </div>
    )
}