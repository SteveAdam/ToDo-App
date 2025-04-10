import { Component, OnInit, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  showDropdown: boolean;
  DueDate:string;
  Priority:string;
}

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  newTaskText: string = '';
  showAddButton: boolean = false;
  currentFilter: 'all' | 'pending' | 'completed' = 'all';
  nextId: number = 1;

  ngOnInit() {
    // Initialize tasks with some default values
    this.tasks = [
      { id: 1, text: 'Renew gym membership', completed: false, showDropdown: false, DueDate:'2023-05-01', Priority:'High' },
      { id: 2, text: 'Create a video for YouTube', completed: true, showDropdown: false , DueDate:'2023-09-03', Priority:'High'},
      { id: 3, text: 'Write a blog about new trends', completed: false, showDropdown: false, DueDate:'2023-08-03', Priority:'High' },
      { id: 4, text: 'Send project file to the client', completed: false, showDropdown: false , DueDate:'2023-04-05', Priority:'High'},
      { id: 5, text: 'Discuss new project with team', completed: false, showDropdown: false , DueDate:'2023-10-11', Priority:'High'}
    ];
    this.nextId = 6;
    this.applyFilter();
  }

  onSearchInput() {
    this.showAddButton = this.newTaskText.trim().length > 0;
    this.applyFilter();
  }

  addTask() {
    if (this.newTaskText.trim()) {
      this.tasks.push({
        id: this.nextId++,
        text: this.newTaskText.trim(),
        completed: false,
        showDropdown: false,
        DueDate: '2023-10-11',
        Priority: 'High'
      });
      this.newTaskText = '';
      this.showAddButton = false;
      this.applyFilter();
    }
  }

  editTask(task: Task) {
    const newText = prompt('Edit task:', task.text);
    if (newText !== null && newText.trim()) {
      task.text = newText.trim();
      task.showDropdown = false;
    }
  }

  deleteTask(taskToDelete: Task) {
    this.tasks = this.tasks.filter(task => task.id !== taskToDelete.id);
    this.applyFilter();
  }

  onTaskStatusChange(task: Task) {
    this.applyFilter();
  }

  toggleDropdown(index: number) {
    // Close all other dropdowns
    this.filteredTasks.forEach((task, i) => {
      if (i !== index) {
        task.showDropdown = false;
      }
    });
    
    // Toggle the current dropdown
    this.filteredTasks[index].showDropdown = !this.filteredTasks[index].showDropdown;
  }

  filterTasks(filter: 'all' | 'pending' | 'completed') {
    this.currentFilter = filter;
    this.applyFilter();
  }

  applyFilter() {
    if (this.newTaskText.trim()) {
     
      const searchTerm = this.newTaskText.toLowerCase();
      this.filteredTasks = this.tasks.filter(task => 
        task.text.toLowerCase().includes(searchTerm)
      );
    } else {
    
      switch (this.currentFilter) {
        case 'pending':
          this.filteredTasks = this.tasks.filter(task => !task.completed);
          break;
        case 'completed':
          this.filteredTasks = this.tasks.filter(task => task.completed);
          break;
        default:
          this.filteredTasks = [...this.tasks];
      }
    }
  }

  clearCompleted() {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.applyFilter();
  }
}
