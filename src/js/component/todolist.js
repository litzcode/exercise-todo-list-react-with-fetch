import React, { useState, useEffect } from "react";

export default function ToDoList() {
	const [list, setList] = useState([]);
	const [input, setInput] = useState("");

	let url = "https://assets.breatheco.de/apis/fake/todos/user/litzy";

	//>> POST method
	const createUser = () =>
		fetch(url, {
			method: "POST",
			body: JSON.stringify([]),
			headers: { "Content-Type": "application/json" }
		})
			.then(resp => {
				console.log("POST request: ", resp.ok);
				resp.status >= 200 && resp.status < 300
					? console.log("POST successful, status: ", resp.status)
					: console.error("POST failed, status: ", resp.status);
				return resp.json();
			})
			.then(response => console.log(response))
			.then(() => getList())
			.catch(error => console.error("Error: ", error));

	//>> GET method
	const getList = () =>
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				console.log("GET request: ", response.ok); // will be true if the response is successfull
				response.status >= 200 && response.status < 300 // the status code = 200 or code = 400 etc.
					? console.log("GET successful, status: ", response.status)
					: console.error("GET failed, status: ", response.status);
				return response.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
			})
			.then(data => {
				setList(data);
				console.log(
					"GET array from server (includes hidden default 'sample task'): ",
					data
				);
			})
			.catch(error => console.error("GET request error: ", error));

	//>> PUT method
	const updateList = () =>
		fetch(url, {
			method: "PUT",
			body: JSON.stringify(list),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(resp => {
				console.log("PUT request: ", resp.ok);
				resp.status >= 200 && resp.status < 300
					? console.log("PUT successful, status: ", resp.status)
					: console.error("PUT failed, status: ", resp.status);
				return resp.json();
			})
			.then(response => {
				setInput("");
				console.log(
					"(Result counter includes hidden default 'sample task')",
					response
				);
			})
			.catch(error => console.error("Error: ", error));

	//>> DELETE method
	const deleteList = () => {
		fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(resp => {
				console.log("DELETE request: ", resp.ok);
				resp.status >= 200 && resp.status < 300
					? console.log("DELETE successful, status: ", resp.status)
					: console.error("DELETE failed, status: ", resp.status);
				return resp.json();
			})
			.then(response => console.log("DELETE response: ", response))
			.then(() => setList([]))
			.then(() => createUser())
			.catch(error => console.error("Error: ", error));
	};

	//>> EVENTS functions where fetch methods are called
	const addTask = event => {
		if (event.keyCode == 13 && input !== "" && input !== "sample task") {
			//setList([...list, { label: input, done: false }]); //Does not work, it does not update in "real time" the API
			let newTask = { label: input, done: false };
			list.splice(list.length, 0, newTask);
			setList([...list]);
			updateList();
		} else if (input == "sample task")
			alert("'sample task' is not a valid input");
	};

	const deleteTask = index => {
		list.splice(index, 1);
		setList([...list]);
		list.length > 0 ? updateList() : deleteList();
	};

	useEffect(() => {
		list.length > 0 ? getList() : createUser();
	}, []);

	return (
		<div className="container">
			<h1>todos</h1>
			<div className="list-container">
				<input
					type="text"
					onChange={e => setInput(e.target.value)}
					value={input}
					onKeyUp={addTask}
					placeholder={
						list.length == 0
							? "No pending tasks, add task here"
							: "Add task here"
					}
				/>
				<ul>
					{list.map((task, index) => (
						<li
							key={index}
							className={
								//class to hide "sample task" added by default
								task.label == "sample task"
									? "d-none"
									: "d-block"
							}>
							{task.label}
							<span onClick={() => deleteTask(index)}>
								<i className="fas fa-times"></i>
							</span>
						</li>
					))}
				</ul>
				<p className="d-flex justify-content-between align-items-center">
					{/*list.length == 0
						? "There are no pending tasks"
						: list.length == 1
						? list.length + " item left"
                        : list.length + " items left"*/}
					{list.length < 2 //starts at 1 because of 1 hidden "sample task" by default
						? "There are no pending tasks"
						: list.length == 2
						? list.length - 1 + " item left"
						: list.length - 1 + " items left"}
					<button
						type="button"
						className="btn btn-secondary btn-sm m-1"
						onClick={deleteList}>
						Delete All
					</button>
				</p>
			</div>
		</div>
	);
}
