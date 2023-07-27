import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemExistingItemUpdateFormComponent } from './todo-item-existing-item-update-form.component';

describe('TodoItemExistingItemUpdateFormComponent', () => {
  let component: TodoItemExistingItemUpdateFormComponent;
  let fixture: ComponentFixture<TodoItemExistingItemUpdateFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoItemExistingItemUpdateFormComponent]
    });
    fixture = TestBed.createComponent(TodoItemExistingItemUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
