import { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function LoginOrCreatePost(props) {
    
    // Note! You should use this in combination with sessionStorage.
    // Otherwise, when the user refreshes the page, it will go away!
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();

    function handleLoginSubmit(e) {
        e?.preventDefault();  // prevents default form submit action

        // TODO: POST to https://cs571api.cs.wisc.edu/rest/f25/ice/login
        fetch('https://cs571api.cs.wisc.edu/rest/f25/ice/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(), // replace with your actual ID
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": usernameRef.current.value,
                "password": passwordRef.current.value
            })
        })
        .then(res => {
            if (res.status === 401) {
                alert("Check credentials");
            }
            else {
                alert("Login successful");
                setIsLoggedIn(true);
            }
        })
    }

    function handleCommentSubmit(e) {
        e?.preventDefault(); // prevents default form submit action
        
        // TODO: POST to https://cs571api.cs.wisc.edu/rest/f25/ice/comments
        fetch('https://cs571api.cs.wisc.edu/rest/f25/ice/comments', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(), // replace with your actual ID
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "comment": document.getElementById("commentInput").value
            })
        })
        .then(res => {
            if (res.status === 401) {
                alert("You must be logged in to post a comment");
                setIsLoggedIn(false);
            }
            else if (res.status === 201) {
                alert("Comment posted successfully");
                props.refreshComments(); // Notify parent to refresh comments
            }
        })
        props.refreshComments();
    }

    function handleLogout() {
        // TODO POST to https://cs571api.cs.wisc.edu/rest/f25/ice/logout
    }

    if (isLoggedIn) {
        return <>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
            <Form onSubmit={handleCommentSubmit}>
                <Form.Label htmlFor="commentInput">Your Comment</Form.Label>
                <Form.Control id="commentInput"></Form.Control>
                <br/>
                <Button type="submit" onClick={handleCommentSubmit}>Post Comment</Button>
            </Form>
        </>
    } else {
        return <Form onSubmit={handleLoginSubmit}>
            <Form.Label htmlFor="usernameInput">Username</Form.Label>
            <Form.Control id="usernameInput" ref={usernameRef}></Form.Control>
            <Form.Label htmlFor="passwordInput">Password</Form.Label>
            <Form.Control id="passwordInput" type="password" ref={passwordRef}></Form.Control>
            <br/>
            <Button type="submit" onClick={handleLoginSubmit}>Login</Button>
        </Form>
    }
}