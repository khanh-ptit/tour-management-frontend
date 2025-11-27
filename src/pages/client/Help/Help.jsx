import React, { useState, useRef, useContext, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { generateAndSendEphemeralKeyPair } from "../../../services/e2e/EKgen";
import { verifySpkSignature_ECDSA_P256 } from "../../../services/e2e/verifySpkSignature";
import { computedDH, computedDHReceiver, computeWhenDhRatchet } from "../../../services/e2e/computeDh";
import { buf2hex, deriveMessageKey, deriveRootAndChainKeys, HMAC } from "../../../services/e2e/hkdf";
import { openDB } from 'idb';
import { decryptMsg, encryptMsg, hexToBuf } from "../../../services/e2e/EncryptAndDecrypt";
import { computeDHFromSenderEK } from "../../../services/e2e/computeDhReceiver";
import { createBKKey, decodeLastestEBKtoBK, decryptByBKKey, encryptByBKKey } from "../../../services/e2e/Backup";
import { initDB } from "../../../services/e2e/initDB";
import { decryptMessages, deriveMkToN, getOtherKey, loadEphemeralKey, loadMessages } from "../../../services/e2e/ChatScreenUtils";
import { backupMsg } from "../../../services/e2e/BackupUtils";
import { message, List, Avatar, Input, Layout, Button } from "antd";
import { useSocket } from "../../../context/SocketContext";
import "./ChatAdmin.scss"; // Import SCSS thông thường
import { logout } from "../../../services/admin/auth.service";

const { Sider, Content } = Layout;

function Help() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [userList,setUserList]=useState([])
  const [needCreatePIN, setNeedCreatePIN] = useState(false); // mở UI nhập 2 lần
// nhập PIN để đồng bộ BK từ EBK
const [needEnterPIN, setNeedEnterPIN] = useState(false);
const [pinInput, setPinInput] = useState("");
const [pinError, setPinError] = useState("");
const [showOtp,setShowOtp]=useState(false)
const [pinAttempts, setPinAttempts] = useState(() => {
  return Number(localStorage.getItem("pinAttempts") || 0);
});
const [otpInput, setOtpInput] = useState("");
const [otpError, setOtpError] = useState("");
const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [pin1, setPin1] = useState("");
const [pin2, setPin2] = useState("");
const [errorPin, setErrorPin] = useState("");
  const [resendCountdown, setResendCountdown] = useState(60);
const [canResend, setCanResend] = useState(false);
      const {stompClient,connected}=useSocket();
const username = localStorage.getItem("username"); 
  const messagesEndRef = useRef(null);
  const [otpExpireTime, setOtpExpireTime] = useState(120); 
useEffect(() => {
  let timer;
  
  if (showOtp) {
    setOtpExpireTime(120); // bắt đầu 2 phút

    timer = setInterval(() => {
      setOtpExpireTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setOtpError("OTP đã hết hạn! Vui lòng gửi lại mã.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => clearInterval(timer);
}, [showOtp]);

  useEffect(() => {
    let timer;
  
    if (showOtp) {
      setCanResend(false);
      setResendCountdown(60);
  
      timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  
    return () => clearInterval(timer);
  }, [showOtp]);
  const handleResendOtp = async () => {
    if (!canResend) return;
  
    try {
      const res = await axios.get(
        `http://localhost:8080/verifyEmailAndCreateNewBK`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("jtoken")}` } }
      );
  
      message.success("Đã gửi lại mã OTP!");
  
     
       setOtpExpireTime(120); // reset thời gian hết hạn
    setCanResend(false);
    setResendCountdown(60); // countdown resend 60 giây
  
    } catch (err) {
      message.error("Không thể gửi lại OTP!");
    }
  };
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/list-users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jtoken")}` },
        });

      const filtered = res.data.result.filter((u) => {
  return u.username !== username && u.role !== "user";
});

      
        setUserList(filtered);
      } catch (err) {
        console.error("Cannot load user list", err);
      }
    };
    fetchUsers();
  }, []);
const handleVerifyOTP = async () => {
  if (!otpInput.trim()) {
    setOtpError("OTP không được để trống");
    return;
  }
  setIsOtpLoading(true);
  setOtpError("");
  try {
    const res = await axios.post(
      "http://localhost:8080/verify-otp",
      { code: otpInput },
      { headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } }
    );

    if (res.data.result === "Verify Otp is successfully") {
      alert("OTP đúng! Vui lòng tạo PIN mới.");
      setShowOtp(false);
      setOtpInput("");
     setNeedCreatePIN(true)
    } else {
      setOtpError("OTP không đúng!");
    }

  } catch (err) {
    console.log(err)
      if(err.response.data.message=="User Is Locked"){
         const result = await logout();
                      localStorage.removeItem("jtoken");
                        localStorage.removeItem("token");
                        localStorage.removeItem("reduxState")
                              localStorage.removeItem("pinAttempts");
            sessionStorage.clear();           
        window.location.href="/locked";
                  //đăng xuất
                   
                  }
    setOtpError("OTP sai hoặc hết hạn!");
  }

  setIsOtpLoading(false);
};

  const handleVerifyPIN = async () => {
     const ebkLastest=await axios.get(
        `http://localhost:8080/getLastestEbk`, { headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } }
    );
  try {
    const {bk,bkVersion} = await decodeLastestEBKtoBK(ebkLastest.data.result,pinInput); // thử giải mã EBK
    const db = await initDB();
  
  
   await db.put('backup_keys',{bk:buf2hex(bk),bkVersion:ebkLastest.data.result.bkVersion,username:ebkLastest.data.result.user.username});
    setNeedEnterPIN(false);
    setPinInput("");
    setPinError("");
    setPinAttempts(0);
    localStorage.setItem("pinAttempts", 0);

    alert("Đồng bộ Backup Key thành công!");
    
  } catch (err) {
    // nhập sai PIN
    console.log(err)
const nextAttempts = pinAttempts + 1;
setPinAttempts(nextAttempts);
localStorage.setItem("pinAttempts", nextAttempts);

    setPinError(`PIN sai (${nextAttempts}/5)`);

    if (nextAttempts >= 5) {
      alert("Sai PIN 5 lần. Bạn phải đổi PIN mới thông qua OTP!");
const res=await axios.get(`http://localhost:8080/verifyEmailAndCreateNewBK`,{ headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } })
      setNeedEnterPIN(false);
      setShowOtp(true)
    }
  }
};

const handleCreateBackupKey = async () => {
  if (pin1.length < 6) {
    setErrorPin("PIN phải >= 6 ký tự");
    return;
  }
  if (pin1 !== pin2) {
    setErrorPin("PIN nhập lại không khớp");
    return;
  }
   // 1️⃣ tạo khóa BK (AES key)
  const { bk, bkVersion, username } = await createBKKey(pin1);
  const db=await initDB()
  await db.put('backup_keys',{bk,bkVersion,username});
  setErrorPin("");
  //bước này cũng lấy bk cũ để re-decript lại theo bk mới  
   alert("Tạo khóa backup thành công!");
   setNeedCreatePIN(false);
}
useEffect(() => {
  const checkBackup = async () => {
    //kiem tra đã tồn tại backupkey trong local chưa nếu chưa goi api đến server nếu có ebk rồi thì
//  nhập mã pin chophep sai 5lan đồng bộ theo ebk đó
//nếu chưa có ebk nào ứng với user nhập mã pin ban đầu xác nhận 2 lần rồi tạo mới bk
const db=await initDB();
if(await db.get("backup_keys",username))return 
      const res = await axios.get(`http://localhost:8080/check-if-exist-any-backup-key?username=${username}`, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } });
console.log(res.data.result)
      if (res.data.result === "created") {
     //lay ebk moi nhat cua  user tu server de dong bo neu có thì đồng bô đc tin nhắn
      setNeedEnterPIN(true);
      }
      else{
        //hiện mã pin cho nhập 2 lần để xác nhận và tạo bk mới.Nếu không đônf bộ đc coi nhu tạo mới mất toàn bộ tin cũ
          setNeedCreatePIN(true);
      }
  };
  checkBackup();
}, []);

useEffect(() => {
  if (!username || !stompClient || !connected) return;
  const subscription = stompClient.subscribe(`/user/${username}/private`, (mes) => {
    (async () => {
        const db = await initDB();
        const id=localStorage.getItem("currentConversationId")
        const session = await db.get("sessions",id);
        const msg = JSON.parse(mes.body);
        console.log("Received message:", msg, "Session:", session);
       const plaintext = await decryptMessages(msg, session);
       //luu backup moi lan nhận và gửi plaintext
       const bkInfor=await db.get("backup_keys",localStorage.getItem("username"))
if(bkInfor){
await backupMsg(plaintext,bkInfor,msg)
}    
        const newMessage = { sender:"other", content: plaintext };
         setMessages((prev) => [...prev, newMessage]);
       console.log(plaintext)
       const res=await axios.post( `http://localhost:8080/updateStatusMessage?id=${msg.id}`,{},
           { headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } }
       )

    })();
  });

  return () => {
    if (subscription) subscription.unsubscribe();
  };
}, [username, stompClient, connected]);
const openChat = async (receiver) => {
    if (!receiver) return;
setMessages([])
    // 1️⃣ Check conversation đã tồn tại?
    const isExist = await axios.post(
        "http://localhost:8080/check-exist-conversation",
        { receiver },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jtoken')}`,
            },
        }
    );

    let conversationId = null;

    // ===== CASE 1: Chưa tồn tại cuộc hội thoại → tạo mới =====
    if (isExist.data.result === "Not created") {
        const newConversation = await axios.post(
            "http://localhost:8080/new-conversation",
            { receiver },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jtoken')}`,
                },
            }
        );

        conversationId = newConversation.data.result.conversationId;
        localStorage.setItem("currentConversationId", conversationId);

        // 1. Tạo EK pair và gửi lên server
        await generateAndSendEphemeralKeyPair(
            newConversation.data.result.createdUser,
            conversationId
        );

        // 2. Lấy các key của receiver
        const otherKey = await getOtherKey(receiver);

        // 3. Verify SPK
        const isValid = await verifySpkSignature_ECDSA_P256(
            otherKey.spkPub,
            otherKey.spkSignature,
            otherKey.ikPub
        );
        if (!isValid) {
            console.error("❌ SPK verification failed!");
            return;
        }

        // 4. DH → IKM
        const ikm = await computedDH(otherKey, conversationId);

        // 5. RK + CKs
        const { rootKey, chainKey } = await deriveRootAndChainKeys(ikm);

        // 6. Load local EK
        const localEphemeral = await loadEphemeralKey(conversationId);

        // 7. Tạo session Double Ratchet
        const sessionState = {
            conversationId,
            rootKey: buf2hex(rootKey),
            cks: buf2hex(chainKey),
            ckr: null,
            DHs: {
                public: localEphemeral.publicKey,
                private: localEphemeral.privateKey,
            },
            DHr: null,
            Ns: 0,
            Nr: 0,
            PN: 0,
            skippedMessageKeys: {},
        };

        const db = await initDB();
        await db.put("sessions", sessionState);
        console.log("Session created (create) and saved:", sessionState);
    }

    // ===== CASE 2: Đã tồn tại conversation nhưng chưa có EK pair =====
    else {
        conversationId = isExist.data.result;
        localStorage.setItem("currentConversationId", conversationId);

        const checkEKPair = await axios.post(
            "http://localhost:8080/check-exist-ek-of-conversation",
            { conversationId },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jtoken')}`,
                },
            }
        );

        const { status, createdUser } = checkEKPair.data.result;

        // Nếu EK chưa có → tạo
        if (status === "not created") {
            await generateAndSendEphemeralKeyPair(createdUser, conversationId);

            // Lấy các key remote
            const otherKey = await getOtherKey(receiver);

            const otherEkPub = await axios.post(
                "http://localhost:8080/get-ek-pub",
                { receiver, conversationId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jtoken')}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const ekPubKey = otherEkPub.data.result;

            const isValid = await verifySpkSignature_ECDSA_P256(
                otherKey.spkPub,
                otherKey.spkSignature,
                otherKey.ikPub
            );
            if (!isValid) {
                console.error("❌ SPK verification failed!");
                return;
            }

            // DH từ sender EK
            const ikm = await computeDHFromSenderEK(ekPubKey, createdUser);

            const { rootKey, chainKey } = await deriveRootAndChainKeys(ikm, null);

            const localEphemeral = await loadEphemeralKey(conversationId);

            // New IKM khi cả 2 có EK
            const newIkm = await computeWhenDhRatchet(
                conversationId,
                ekPubKey
            );

            const db = await initDB();
            const oldRootKey = rootKey;

            const newKey = await deriveRootAndChainKeys(newIkm, oldRootKey);

            // Create session
            const sessionState = {
                conversationId,
                rootKey: buf2hex(newKey.rootKey),
                cks: buf2hex(newKey.chainKey),
                ckr: buf2hex(chainKey),
                DHs: {
                    public: localEphemeral.publicKey,
                    private: localEphemeral.privateKey,
                },
                DHr: ekPubKey,
                Ns: 0,
                Nr: 0,
                PN: 0,
                skippedMessageKeys: {},
            };

            await db.put("sessions", sessionState);
            console.log("Session created (join) and saved:", sessionState);
        }
    }

    // 3️⃣ Load tin nhắn cũ
    const id = localStorage.getItem("currentConversationId");
    const oldMessages = await loadMessages(id);

    if (oldMessages.length > 0) setMessages(oldMessages);

    // Set UI
    setActiveUser(receiver);
};
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeUser) return;
    const newMessage = { sender: localStorage.getItem("username"), content: inputMessage };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    //mã hóa bằng cks và gửi lên server 
  // Lấy session từ IndexedDB
const db = await initDB();
 const testSession = await db.get('sessions',  localStorage.getItem("currentConversationId"));
  if (!testSession) {
    console.log(`No session found for conversationId`);
    return;
  }
  //neu gửi được 10 tin nhắn và bên kia đã join vào cuộc hội thoại rồi thì mới thực hiện dhratchet
  if(testSession.Ns>=10){
    //kiểm tra bên kia đã join cuộc hội thoại chưa
    const otherEkPub= await axios.post(  "http://localhost:8080/get-ek-pub",
        { receiver:activeUser,conversationId:localStorage.getItem("currentConversationId") },
        {headers: {
            Authorization: `Bearer ${localStorage.getItem('jtoken')}`,
            'Content-Type': 'application/json'
        }})
         //thưc hiện tạo lại dh ratchet 
    //tao cap ek pair mới tương đương với dhpub và dhpriv mới ghi đè lại ek ứng với conversation và userid 
    //sử dụng dh này kết hợp với rootkey cũ sẽ sinh ra được rootkey mới và chain key mới
    //update ns của chain này về 0
        if(otherEkPub.data.result!=="not yet joined"){
 await generateAndSendEphemeralKeyPair(localStorage.getItem("username"), localStorage.getItem("currentConversationId"));
  // 2️⃣ DH Ratchet(tao ikm chung mới )
               const newIkm = await computeWhenDhRatchet(localStorage.getItem("currentConversationId"), otherEkPub.data.result)
         const oldSessions = await db.get("sessions", localStorage.getItem("currentConversationId"))
        const oldRootKey = oldSessions.rootKey
        //kết hợp với rootkey cũ
        const newKey = await deriveRootAndChainKeys(newIkm, hexToBuf(oldRootKey))
 const oldSession = await db.get("sessions", localStorage.getItem("currentConversationId"))
   const localEphemeral = await loadEphemeralKey(localStorage.getItem("currentConversationId"));
  
         const sessionState = {
        conversationId:localStorage.getItem("currentConversationId"),
        rootKey: buf2hex(newKey.rootKey),
        cks: buf2hex(newKey.chainKey),
        ckr: oldSession.ckr,
        DHs: {
            public: localEphemeral.publicKey,
            private: localEphemeral.privateKey
        },
        DHr: otherEkPub.data.result,
        Ns: 0,
        Nr: 0,
        PN: 0,
        skippedMessageKeys: {}
    };
    // 7️⃣ Lưu session vào IndexedDB
       await db.put('sessions', sessionState);
          }
   
  }
   const session = await db.get('sessions',  localStorage.getItem("currentConversationId"));
  // 1️⃣ Derive message key và CK mới
  const mk = await HMAC(hexToBuf(session.cks), new Uint8Array([0x01])); // message key
  const newCKs = await HMAC(hexToBuf(session.cks), new Uint8Array([0x02])); // CK gửi kế tiếp
  // 2️⃣ Mã hóa message
  const { iv, ciphertext } =await encryptMsg(inputMessage, mk);

  // 3️⃣ Cập nhật sessionState
  session.cks = buf2hex(newCKs);   // CK gửi mới
  session.Ns += 1;                 // tăng counter gửi
  session.PN = session.Ns;         // optional: PN theo protocol
 await db.put('sessions', session);
  // 4️⃣ Chuẩn bị payload gửi server offline status pending
const payload = {
    receiver: activeUser,
    ciphertext: buf2hex(ciphertext),
    iv: buf2hex(iv),
    n: session.Ns,
    pn: session.PN,
    dhPub: session.DHs.public,
    conversationId: localStorage.getItem("currentConversationId")
  };
  const res = await axios.post('http://localhost:8080/send-message', payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` }
    });
      const payloadSend = {
        id:res.data.result,
        sender:localStorage.getItem("username"),
    receiver: activeUser,
    ciphertext: buf2hex(ciphertext),
    iv: buf2hex(iv),
    n: session.Ns,
    pn: session.PN,
    dhPub: session.DHs.public,
    conversationId: localStorage.getItem("currentConversationId")
  };
//sư dụng bk để backup
//nếu chưa có bk thì cần lấy ebk mới nhất về để đồng bộ nếu chưa có ebk nào thì tạo mới(TH này là ng dùng xóabước này cũng cầnverifyqua otp)
const bkInfor=await db.get("backup_keys",localStorage.getItem("username"))

if(bkInfor){
const encryptInfo=await encryptByBKKey(inputMessage,hexToBuf(bkInfor.bk))
//gui thong tin message backup len server
const backupMsg={
bkVersion:bkInfor.bkVersion,
iv:encryptInfo.iv,
cipherText:encryptInfo.ciphertext,
conversationId:localStorage.getItem("currentConversationId"),
sender:localStorage.getItem("username"),
receiver:activeUser
}
console.log(backupMsg)
const backupRes= await axios.post(`http://localhost:8080/backup-message`,backupMsg,
   { headers: { Authorization: `Bearer ${localStorage.getItem('jtoken')}` } })
}    
stompClient.send("/app/direct",{},
      JSON.stringify(payloadSend)
    )
  }
  return (

  <Layout className="chat-admin">

    {/* Popup nhập PIN */}
    {needEnterPIN && (
      <div className="pin-popup">
        <h3>Nhập PIN để đồng bộ Backup Key</h3>
        <input
          type="password"
          placeholder="Nhập PIN"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
        />
        {pinError && <p style={{ color: "red" }}>{pinError}</p>}
        <button onClick={handleVerifyPIN}>Xác nhận</button>
      </div>
    )}

    {/* Popup tạo PIN */}
    {needCreatePIN && (
      <div className="pin-popup">
        <h3>Tạo mã PIN để đặt mật khẩu Backup</h3>
        <input
          type="password"
          placeholder="Nhập PIN"
          value={pin1}
          onChange={(e) => setPin1(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nhập lại PIN"
          value={pin2}
          onChange={(e) => setPin2(e.target.value)}
        />
        {errorPin && <p style={{ color: "red" }}>{errorPin}</p>}
        <button onClick={handleCreateBackupKey}>Xác nhận</button>
      </div>
    )}

    {/* OTP popup */}
     {showOtp && (
      <div className="otp_container">
        <div className="otp_sc">
       
   <h3>Xác nhận OTP để đổi PIN</h3>

    <input
      type="text"
      placeholder="Nhập mã OTP"
      value={otpInput}
      onChange={(e) => setOtpInput(e.target.value)}
    />

    {otpError && <p style={{ color: "red" }}>{otpError}</p>}

    <button onClick={handleVerifyOTP}  disabled={otpExpireTime === 0 || isOtpLoading}>
      {isOtpLoading ? "Đang kiểm tra..." : "Xác nhận OTP"}
    </button>

    {/* Nút gửi lại OTP */}
    <button
      onClick={handleResendOtp}
      disabled={!canResend}
      style={{
        marginTop: "10px",
        opacity: canResend ? 1 : 0.5,
        cursor: canResend ? "pointer" : "not-allowed",
      }}
    >
      {canResend ? "Gửi lại mã OTP" : `Gửi lại sau ${resendCountdown}s`}
    </button>
     <div style={{ marginTop: 10, color: "red" }}>
    OTP sẽ hết hạn sau: {Math.floor(otpExpireTime / 60)}:
    {(otpExpireTime % 60).toString().padStart(2, "0")}
  </div>
        </div>
      </div>
    )}

    {/* Sau khi xử lý PIN/OTP mới show chat */}
    {!needEnterPIN && !needCreatePIN && !showOtp && (
      <>
        {/* SIDEBAR USER LIST */}
        <Sider width={300} className="chat-sidebar">
          <h2>Chăm sóc khách hàng</h2>

          {userList.map((u) => (
            <div
              key={u.username}
              className={`chat-room ${
                activeUser === u.username ? "active" : ""
              }`}
              onClick={() => openChat(u.username)}
            >
              👤 {u.username}
            </div>
          ))}
        </Sider>

        {/* CHAT CONTENT */}
        <Content className="chat-content">
<div className="chat-header">
  <div className="chat-header-left">
    <span className="chat-title">
      {activeUser ? `💬 Admin` : "Chat Admin"}
    </span>
  </div>


    <div className="chat-header-right">
      <div
        className="e2ee-badge"
        title="Các tin nhắn trong cuộc trò chuyện này được mã hóa đầu cuối"
      >
        🔒
        <span className="e2ee-text">Đuợc mã hóa đầu cuối</span>
      </div>
    </div>

</div>




          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${
                  msg.sender === localStorage.getItem("username")
                    ? "admin"
                    : "user"
                }`}
              >
                {msg.content}
              </div>
            ))}

            <div ref={messagesEndRef}></div>
          </div>

          {activeUser && (
            <div className="chat-input-container">
              <input
                className="ant-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                className="ant-btn ant-btn-primary"
                onClick={handleSendMessage}
                disabled={!stompClient || !connected}
              >
                Gửi
              </button>
            </div>
          )}
        </Content>
      </>
    )}
  </Layout>
);

 
}

export default Help;
