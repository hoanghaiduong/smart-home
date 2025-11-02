
import React, { useState, useMemo } from 'react';
import { GlassCard } from './GlassCard';
import { Table, type Column } from './common/Table';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { ConfirmationDialog } from './common/ConfirmationDialog';
import type { Room } from '../types';

interface RoomManagementProps {
    rooms: Room[];
    onAdd: (roomData: Omit<Room, 'id' | 'devices' | 'alerts'>) => void;
    onUpdate: (roomId: number, roomData: Partial<Omit<Room, 'id' | 'devices'>>) => void;
    onDelete: (roomId: number) => void;
}

export const RoomManagement: React.FC<RoomManagementProps> = ({ rooms, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

    const columns: Column<Room>[] = useMemo(() => [
        { header: 'Tên phòng', accessor: 'name', isSortable: true },
        // FIX: Changed accessor to 'devices' which is a valid key of `Room`.
        // 'deviceCount' is a derived value and not a property on the Room object.
        // Also set isSortable to false as sorting by an array of devices is not meaningful.
        { header: 'Số thiết bị', accessor: 'devices', isSortable: false, render: (room) => room.devices.length },
        { header: 'Nhiệt độ', accessor: 'temperature', isSortable: true, render: (room) => room.temperature ? `${room.temperature}°C` : 'N/A' },
        { header: 'Hành động', accessor: 'actions', render: (room) => (
            <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleEdit(room); }}>Sửa</Button>
                <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); setRoomToDelete(room); }}>Xoá</Button>
            </div>
        )}
    ], []);

    const handleEdit = (room: Room) => {
        setEditingRoom(room);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingRoom(null);
        setIsModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRoom(null);
    };
    
    const handleSave = (formData: Record<string, any>) => {
        if (editingRoom) {
            onUpdate(editingRoom.id, { name: formData.name, temperature: parseFloat(formData.temperature) });
        } else {
            onAdd({ name: formData.name, temperature: parseFloat(formData.temperature) });
        }
        handleCloseModal();
    };

    const handleDeleteConfirm = () => {
        if (roomToDelete) {
            onDelete(roomToDelete.id);
            setRoomToDelete(null);
        }
    }

    return (
        <>
            <GlassCard>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Quản lý phòng (Room Management)</h2>
                    <Button onClick={handleAddNew}>Thêm phòng mới</Button>
                </div>
                <Table
                    columns={columns}
                    data={rooms}
                    searchKeys={['name']}
                />
            </GlassCard>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
            >
                <RoomForm
                    initialData={editingRoom}
                    onSubmit={handleSave}
                    onCancel={handleCloseModal}
                />
            </Modal>
            
            <ConfirmationDialog
                isOpen={!!roomToDelete}
                onClose={() => setRoomToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xoá phòng"
                message={`Bạn có chắc chắn muốn xoá phòng "${roomToDelete?.name}" không? Tất cả các thiết bị trong phòng này cũng sẽ bị xoá.`}
            />
        </>
    );
};


interface RoomFormProps {
    initialData?: Room | null;
    onSubmit: (data: Record<string, any>) => void;
    onCancel: () => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        temperature: initialData?.temperature || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Tên phòng"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <Input
                label="Nhiệt độ (tuỳ chọn)"
                id="temperature"
                name="temperature"
                type="number"
                value={formData.temperature.toString()}
                onChange={handleChange}
                step="0.1"
            />
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Huỷ</Button>
                <Button type="submit">Lưu</Button>
            </div>
        </form>
    );
};
