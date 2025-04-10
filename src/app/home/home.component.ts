import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { random } from 'lodash';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  showDetails: boolean;
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
  showFilters: boolean = false;
  priorityFilter: string = 'all';
  dueDateFilter: string = '';

  ngOnInit() {
    // Initialize tasks with some default values
    this.tasks = [
      { id: 1, text: 'Renew gym membership', completed: false, showDropdown: false, showDetails: false ,DueDate:'2023-05-01', Priority:'High' },
      { id: 2, text: 'Create a video for YouTube', completed: true, showDropdown: false , showDetails:false , DueDate:'2023-09-03', Priority:'High'},
      { id: 3, text: 'Write a blog about new trends', completed: false, showDropdown: false, showDetails:false, DueDate:'2023-08-03', Priority:'Medium' },
      { id: 4, text: 'Send project file to the client', completed: false, showDropdown: false, showDetails:false , DueDate:'2023-04-05', Priority:'Low'},
      { id: 5, text: 'Discuss new project with team', completed: false, showDropdown: false, showDetails:false , DueDate:'2023-10-11', Priority:'Low'}
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
        showDetails: false,
        DueDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
        Priority: 'Low',
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
    // Additional logic when task status changes if needed
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

  toggleDetails(index: number) {
    // Close all other details
    this.filteredTasks.forEach((task, i) => {
      if (i !== index) {
        task.showDetails = false;
      }
    });
    
    // Toggle the current details
    this.filteredTasks[index].showDetails = !this.filteredTasks[index].showDetails;
  }

  updateDueDate(task: Task, event: Event) {
    const input = event.target as HTMLInputElement;
    task.DueDate = input.value;
    this.applyFilter();
  }

  updatePriority(task: Task, priority: string) {
    task.Priority = priority;
    this.applyFilter();
  }

  filterTasks(filter: 'all' | 'pending' | 'completed') {
    this.currentFilter = filter;
    this.applyFilter();
  }

  filterByPriority(priority: string) {
    this.priorityFilter = priority;
    this.applyFilter();
  }

  filterByDueDate(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dueDateFilter = input.value;
    this.applyFilter();
  }

  toggleFiltersPanel() {
    this.showFilters = !this.showFilters;
  }

  resetFilters() {
    this.currentFilter = 'all';
    this.priorityFilter = 'all';
    this.dueDateFilter = '';
    this.applyFilter();
  }

  applyFilter() {
    let filtered = [...this.tasks];
    
    // Filter by search text
    if (this.newTaskText.trim()) {
      const searchTerm = this.newTaskText.toLowerCase();
      filtered = filtered.filter(task => 
        task.text.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(task => 
        (this.currentFilter === 'completed' ? task.completed : !task.completed)
      );
    }
    
    // Apply priority filter
    if (this.priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.Priority === this.priorityFilter);
    }
    
    // Apply due date filter
    if (this.dueDateFilter) {
      filtered = filtered.filter(task => task.DueDate === this.dueDateFilter);
    }
    
    this.filteredTasks = filtered;
  }

  clearCompleted() {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.applyFilter();
  }

  getDaysUntilDue(dueDate: string): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  }
}
