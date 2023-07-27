import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemSearchPageComponent } from './todo-item-search-page.component';

describe('TodoItemSearchPageComponent', () => {
  let component: TodoItemSearchPageComponent;
  let fixture: ComponentFixture<TodoItemSearchPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoItemSearchPageComponent]
    });
    fixture = TestBed.createComponent(TodoItemSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
